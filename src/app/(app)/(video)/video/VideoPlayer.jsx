"use client";
import "plyr/dist/plyr.css";
import "./video.scss";
import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import CryptoJS from "crypto-js";
import {
  BlockedComponent,
  enhanceSecurityDetectorWithMicrophone,
  SecurityDetector,
} from "./SecurityDetector";

// ===== UTILITY FUNCTIONS =====
const getCurrentHourNumber = () => {
  const result = new Date().getHours() % 10 || 1;
  return result;
};

const getVietnameseDayName = () => {
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
};

const createTimeBasedMD5 = () => {
  const hashString = getCurrentHourNumber().toString() + getVietnameseDayName();
  const md5Hash = CryptoJS.MD5(hashString).toString();
  return md5Hash;
};

// ===== DECRYPTION HELPER =====
const decryptVideoData = (encryptedData) => {
  const hourNumber = getCurrentHourNumber();
  const md5Hash = createTimeBasedMD5();

  const cleanedData = encryptedData
    .replaceAll(md5Hash, hourNumber)
    .replaceAll("/kopwefd", "H")
    .replaceAll("ixgrgfd/", "D");

  const binaryString = atob(cleanedData);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
};

// ===== HLS CONFIGURATION =====
const getHLSConfig = () => ({
  enableWorker: true,
  lowLatencyMode: true,
  maxBufferLength: 30, // Giảm buffer để phản ứng nhanh hơn
  maxMaxBufferLength: 60, // Giảm max buffer
  maxBufferSize: 30 * 1000 * 1000, // Giảm buffer size
  maxBufferHole: 0.5, // Tăng tolerance cho buffer hole
  debug: false,
  fragLoadingTimeOut: 20000,
  fragLoadingMaxRetry: 4,
  fragLoadingRetryDelay: 1000,
  manifestLoadingTimeOut: 10000,
  manifestLoadingMaxRetry: 1,

  // ===== IMPROVED ADAPTIVE BITRATE CONFIG =====
  startLevel: -1, // Vẫn để auto nhưng sẽ config thêm logic
  capLevelToPlayerSize: true, // Giới hạn theo kích thước player

  // Bandwidth estimation - Aggressive cho quality cao
  abrEwmaDefaultEstimate: 5000000, // 5Mbps estimate ban đầu (cao hơn)
  abrEwmaFastLive: 2.0, // Nhanh hơn cho live stream
  abrEwmaSlowLive: 6.0, // Chậm hơn để ổn định
  abrEwmaFastVoD: 2.0, // Nhanh hơn cho VoD
  abrEwmaSlowVoD: 6.0, // Chậm hơn để ổn định

  // Bandwidth factors - Ít conservative hơn
  abrBandWidthFactor: 0.95, // Dùng 85% bandwidth (thay vì 70%)
  abrBandWidthUpFactor: 0.85, // Dễ dàng hơn khi tăng quality

  // Starvation handling - Nhanh hơn
  maxStarvationDelay: 2, // Giảm thời gian chờ trước khi giảm quality
  maxLoadingDelay: 2, // Giảm thời gian loading tối đa

  // Buffer thresholds
  liveSyncDurationCount: 3, // Sync với live stream
  liveMaxLatencyDurationCount: 10,

  // Fragment loading
  levelLoadingTimeOut: 8000, // Giảm timeout
  levelLoadingMaxRetry: 3, // Giảm retry
  levelLoadingRetryDelay: 500, // Giảm delay

  // Thêm config cho quality switching
  manifestLoadingTimeOut: 10000,
  manifestLoadingMaxRetry: 2,

  // ABR Controller tweaks - bỏ override constructor
});

// ===== PLYR CONFIGURATION =====
const getPlyrConfig = (availableResolutions, onQualityChange) => ({
  quality: {
    default: 0,
    options: [0, ...availableResolutions],
    forced: true,
    onChange: (quality) => {
      // Thêm delay nhỏ để tránh conflict
      setTimeout(() => {
        onQualityChange(quality);
      }, 50);
    },
  },
  i18n: {
    qualityLabel: {
      0: "Auto",
    },
    // Thêm label cho loop
    loop: "Lặp lại",
    // Thêm các label khác nếu cần
    speed: "Tốc độ",
    normal: "Bình thường",
  },
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "loop",
    "settings",
    "pip",
    "fullscreen",
  ],
  settings: ["quality", "speed", "loop"],
  speed: {
    selected: 1,
    options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
  },
  loop: { active: true },
  autoplay: true,
  muted: true,
});

// ===== MAIN COMPONENT =====
const VideoPlayerCore = ({ m3u8Url }) => {
  // State
  const [currentResolution, setCurrentResolution] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);
  const securityDetectorRef = useRef(null);

  // Security violation handler
  const handleSecurityViolation = useCallback((reason, severity = 1) => {
    console.warn(`🚨 Security Violation: ${reason} (Severity: ${severity})`);
    setIsBlocked(true);

    // Tắt video và âm thanh
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
      videoRef.current.src = "";
    }

    // Destroy HLS
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Destroy Plyr
    if (plyrRef.current) {
      plyrRef.current.destroy();
      plyrRef.current = null;
    }
  }, []);

  // Initialize security
  const initializeSecurity = useCallback(() => {
    if (securityDetectorRef.current) {
      securityDetectorRef.current.destroy();
    }
    enhanceSecurityDetectorWithMicrophone(SecurityDetector);
    securityDetectorRef.current = new SecurityDetector(handleSecurityViolation);
  }, [handleSecurityViolation]);

  const handleResolutionChange = (newQuality) => {
    if (!hlsRef.current || !videoRef.current || isBlocked) return;

    const currentTime = videoRef.current.currentTime;
    const isPaused = videoRef.current.paused;

    if (newQuality === 0) {
      hlsRef.current.currentLevel = -1; // Enable AUTO quality
    } else {
      hlsRef.current.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          hlsRef.current.currentLevel = levelIndex;
          // Seek lại vị trí hiện tại để load segment mới
          setTimeout(() => {
            if (videoRef.current && !isNaN(currentTime)) {
              videoRef.current.currentTime = currentTime;
              if (!isPaused) {
                videoRef.current.play().catch(console.warn);
              }
            }
          }, 100);
        }
      });
    }
  };

  const createCustomFragmentLoader = (Hls) => {
    class CustomFragmentLoader extends Hls.DefaultConfig.loader {
      constructor(config) {
        super(config);
      }

      load(context, config, callbacks) {
        // Kiểm tra bảo mật trước khi load
        if (isBlocked) {
          callbacks.onError(
            {
              code: 403,
              text: "Content blocked due to security violation",
              response: { url: context.url, status: 403 },
            },
            context,
            null
          );
          return;
        }

        const { url } = context;

        if (url.includes("/api/video/")) {
          this.loadCustomSegment(url, context, config, callbacks);
        } else {
          super.load(context, config, callbacks);
        }
      }

      async loadCustomSegment(url, context, config, callbacks) {
        try {
          if (isBlocked) {
            throw new Error("Content blocked");
          }

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "X-API-KEY": "123456",
              "Content-Type": "application/json",
            },
            cache: "no-cache",
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const jsonData = await response.json();

          if (!jsonData.data) {
            throw new Error("No video data in response");
          }

          const decodedData = decryptVideoData(jsonData.data);

          const customResponse = {
            url: url,
            data: decodedData,
            status: 200,
            statusText: "OK",
            headers: {
              "content-type": "video/mp2t",
              "content-length": decodedData.byteLength.toString(),
            },
          };

          callbacks.onSuccess(customResponse, { url }, context);
        } catch (error) {
          console.error("Custom loader error:", error);
          callbacks.onError(
            {
              code: error.code || 0,
              text: error.message || "Load failed",
              response: { url, status: 500 },
            },
            context,
            null
          );
        }
      }

      abort() {}
      destroy() {}
    }

    return CustomFragmentLoader;
  };

  const handleHLSError = (hls, data) => {
    if (isBlocked) return;

    console.warn("HLS Error:", data);

    if (data.fatal) {
      switch (data.type) {
        case hls.constructor.ErrorTypes.NETWORK_ERROR:
          console.log("Network error, trying to recover...");
          hls.startLoad();
          break;
        case hls.constructor.ErrorTypes.MEDIA_ERROR:
          console.log("Media error, trying to recover...");
          hls.recoverMediaError();
          break;
        default:
          console.log("Fatal error, destroying HLS...");
          hls.destroy();
          // Reinitialize sau một khoảng thời gian
          setTimeout(() => {
            if (!isBlocked) {
              initializeHLSPlayer();
            }
          }, 1000);
          break;
      }
    }
  };

  // 1. Thêm WeakSet để track các player đã setup
  const setupPlayers = new WeakSet();

  const fadeInVolume = (player, targetVolume, duration) => {
    let fadeInterval;
    let cancelled = false;
    let destroyHandler = null;

    // Helper function để kiểm tra player an toàn - cải thiện
    const isPlayerValid = (p) => {
      try {
        return (
          p &&
          p !== null &&
          p !== undefined &&
          !p.destroyed &&
          p.media &&
          p.media !== null &&
          typeof p.volume !== "undefined" &&
          // Thêm check DOM element
          p.media.parentNode &&
          document.contains(p.media)
        );
      } catch (e) {
        return false;
      }
    };

    // Helper function để set volume an toàn
    const safeSetVolume = (p, vol) => {
      try {
        if (isPlayerValid(p)) {
          p.volume = Math.min(Math.max(vol, 0), 1);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    };

    const promise = new Promise((resolve, reject) => {
      // Kiểm tra ngay từ đầu
      if (!isPlayerValid(player)) {
        // Không reject mà resolve luôn để tránh unhandled promise
        console.warn("Player invalid, bỏ qua fade");
        resolve();
        return;
      }

      const startVolume = 0;
      const volumeStep = targetVolume / (duration / 50);
      let currentVolume = startVolume;

      // Thử set volume ban đầu
      if (!safeSetVolume(player, startVolume)) {
        console.warn("Không thể set volume ban đầu, bỏ qua fade");
        resolve(); // Resolve thay vì reject
        return;
      }

      try {
        if (isPlayerValid(player)) {
          player.muted = false;
        }
      } catch (e) {
        console.warn("Không thể unmute player:", e.message);
        resolve(); // Resolve thay vì reject
        return;
      }

      fadeInterval = setInterval(() => {
        try {
          // Check nếu bị cancel
          if (cancelled) {
            clearInterval(fadeInterval);
            resolve(); // Resolve thay vì reject khi cancel
            return;
          }

          // Kiểm tra player còn valid không
          if (!isPlayerValid(player)) {
            clearInterval(fadeInterval);
            console.warn("Player không còn valid, dừng fade");
            resolve(); // Resolve thay vì reject
            return;
          }

          currentVolume += volumeStep;

          if (currentVolume >= targetVolume) {
            currentVolume = targetVolume;
            clearInterval(fadeInterval);

            // Final volume set với kiểm tra an toàn
            if (safeSetVolume(player, currentVolume)) {
              resolve();
            } else {
              console.warn("Không thể set final volume");
              resolve(); // Resolve thay vì reject
            }
            return;
          }

          // Set volume với kiểm tra an toàn
          if (!safeSetVolume(player, currentVolume)) {
            clearInterval(fadeInterval);
            console.warn("Không thể set volume trong quá trình fade");
            resolve(); // Resolve thay vì reject
            return;
          }
        } catch (callbackError) {
          clearInterval(fadeInterval);
          console.warn("Lỗi trong callback fade:", callbackError.message);
          resolve(); // Resolve thay vì reject
        }
      }, 50);

      // Cleanup on destroy - cải thiện
      if (player && typeof player.on === "function") {
        destroyHandler = () => {
          if (fadeInterval) {
            clearInterval(fadeInterval);
            fadeInterval = null;
          }
          cancelled = true;
          resolve(); // Resolve thay vì reject khi destroy
        };

        try {
          player.on("destroy", destroyHandler);
        } catch (e) {
          console.warn("Không thể add destroy listener:", e.message);
        }
      }
    });

    // Cleanup function
    const cleanup = () => {
      cancelled = true;
      if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
      if (
        destroyHandler &&
        isPlayerValid(player) &&
        typeof player.off === "function"
      ) {
        try {
          player.off("destroy", destroyHandler);
        } catch (e) {
          // Ignore
        }
      }
    };

    promise.cancel = cleanup;

    // Cleanup khi promise hoàn thành
    promise.finally(() => {
      if (
        destroyHandler &&
        isPlayerValid(player) &&
        typeof player.off === "function"
      ) {
        try {
          player.off("destroy", destroyHandler);
        } catch (e) {
          // Ignore
        }
      }
    });

    return promise;
  };

  const setupAutoVolumeFadeIn = (player) => {
    // Kiểm tra xem đã setup chưa để tránh duplicate
    if (setupPlayers.has(player)) {
      return () => {}; // Return empty cleanup
    }

    setupPlayers.add(player);

    const FADE_DURATION = 1000;
    const TARGET_VOLUME = 1;
    const DELAY_START = 1000;

    let fadeTimeout;
    let currentFadePromise;
    let isDestroyed = false; // Flag để track destroy state

    // Helper function cải thiện
    const isPlayerValid = (p) => {
      try {
        return (
          !isDestroyed &&
          p &&
          p !== null &&
          p !== undefined &&
          !p.destroyed &&
          p.media &&
          p.media !== null &&
          typeof p.volume !== "undefined" &&
          p.media.parentNode &&
          document.contains(p.media)
        );
      } catch (e) {
        return false;
      }
    };

    const handlePlaying = async () => {
      // Kiểm tra player valid trước khi làm gì
      if (!isPlayerValid(player)) {
        return;
      }

      // Chỉ fade lần đầu tiên
      if (!player.hasVolumeAdjusted) {
        player.hasVolumeAdjusted = true;

        // Clear timeout cũ nếu có
        if (fadeTimeout) {
          clearTimeout(fadeTimeout);
        }

        fadeTimeout = setTimeout(async () => {
          try {
            // Double check player vẫn còn valid
            if (!isPlayerValid(player)) {
              return;
            }

            currentFadePromise = fadeInVolume(
              player,
              TARGET_VOLUME,
              FADE_DURATION
            );
            await currentFadePromise;
            console.log("Volume fade in thành công");
          } catch (error) {
            // Bỏ qua tất cả error vì đã handle trong fadeInVolume
            console.warn("Fade in hoàn thành với warning:", error.message);
          } finally {
            fadeTimeout = null;
            currentFadePromise = null;
          }
        }, DELAY_START);
      }
    };

    // Add event listener với error handling
    try {
      if (player && typeof player.on === "function") {
        player.on("playing", handlePlaying);
      }
    } catch (e) {
      console.warn("Không thể add playing listener:", e.message);
      return () => {}; // Return empty cleanup
    }

    // Cleanup function
    const cleanup = () => {
      isDestroyed = true; // Mark as destroyed

      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
        fadeTimeout = null;
      }

      if (currentFadePromise && currentFadePromise.cancel) {
        currentFadePromise.cancel();
        currentFadePromise = null;
      }

      // Remove event listener
      if (player && typeof player.off === "function") {
        try {
          player.off("playing", handlePlaying);
        } catch (e) {
          // Ignore
        }
      }

      // Remove from WeakSet
      setupPlayers.delete(player);
    };

    // Auto cleanup khi player destroy
    if (player && typeof player.on === "function") {
      try {
        player.on("destroy", cleanup);
      } catch (e) {
        console.warn("Không thể add destroy cleanup:", e.message);
      }
    }

    return cleanup;
  };

  // Cải thiện initializePlyrPlayer
  const initializePlyrPlayer = async (availableResolutions) => {
    try {
      if (!plyrRef.current && videoRef.current && !isBlocked) {
        const { default: Plyr } = await import("plyr");

        // Cleanup player cũ nếu có
        if (plyrRef.current) {
          try {
            plyrRef.current.destroy();
          } catch (e) {
            console.warn("Lỗi khi destroy player cũ:", e.message);
          }
          plyrRef.current = null;
        }

        const player = new Plyr(
          videoRef.current,
          getPlyrConfig(availableResolutions, handleResolutionChange)
        );

        plyrRef.current = player;

        // Setup volume fade với error handling
        try {
          const cleanupFade = setupAutoVolumeFadeIn(player);

          // Store cleanup function để có thể gọi sau
          if (player) {
            player._fadeCleanup = cleanupFade;
          }
        } catch (e) {
          console.warn("Lỗi khi setup volume fade:", e.message);
        }
      }
    } catch (error) {
      console.error("Lỗi khởi tạo Plyr player:", error);
      // Reset state
      plyrRef.current = null;
    }
  };

  // Thêm cleanup khi component unmount hoặc player thay đổi
  const cleanupPlayer = () => {
    if (plyrRef.current) {
      try {
        // Gọi fade cleanup nếu có
        if (plyrRef.current._fadeCleanup) {
          plyrRef.current._fadeCleanup();
        }

        // Destroy player
        plyrRef.current.destroy();
      } catch (e) {
        console.warn("Lỗi khi cleanup player:", e.message);
      } finally {
        plyrRef.current = null;
      }
    }
  };

  const setupHLSEventHandlers = (hls) => {
    // Khởi tạo smart ABR tracking
    let lastBandwidth = 5000000; // 5Mbps initial
    let bufferHealthHistory = [];
    let startTime = Date.now();
    let hasStarted = false;
    const targetBufferLevel = 15;
    const minBufferLevel = 5;

    // Helper function để tìm level tối ưu
    const getOptimalLevel = (currentLevel, bandwidth, bufferLength) => {
      const levels = hls.levels;
      if (!levels || levels.length === 0) return currentLevel;

      // Ghi buffer health
      bufferHealthHistory.push(bufferLength);
      if (bufferHealthHistory.length > 10) {
        bufferHealthHistory.shift();
      }

      const avgBufferHealth =
        bufferHealthHistory.reduce((a, b) => a + b, 0) /
        bufferHealthHistory.length;
      let targetLevel = currentLevel;

      // Logic cho giai đoạn đầu (10 giây đầu)
      const isStarting = Date.now() - startTime < 10000;

      if (isStarting && !hasStarted) {
        // Bắt đầu với quality cao
        const video = hls.media;
        const playerWidth = video ? video.clientWidth : 1920;

        // Tìm level cao nhất phù hợp
        for (let i = levels.length - 1; i >= 0; i--) {
          const level = levels[i];
          if (
            level.bitrate <= bandwidth * 0.7 &&
            level.width <= playerWidth * 1.2
          ) {
            targetLevel = i;
            break;
          }
        }
        hasStarted = true;
      } else {
        // Logic adaptive thông thường
        if (
          avgBufferHealth > targetBufferLevel &&
          bandwidth > levels[currentLevel]?.bitrate * 1.2 // Giảm từ 1.3 xuống 1.2
        ) {
          // Buffer khỏe và bandwidth tốt -> tăng quality
          for (let i = currentLevel + 1; i < levels.length; i++) {
            if (levels[i].bitrate <= bandwidth * 0.9) {
              // Tăng từ 0.8 lên 0.9
              targetLevel = i;
            } else {
              break;
            }
          }
        } else if (
          avgBufferHealth < minBufferLevel ||
          bandwidth < levels[currentLevel]?.bitrate * 0.8
        ) {
          // Buffer yếu hoặc bandwidth kém -> giảm quality
          for (let i = currentLevel - 1; i >= 0; i--) {
            if (levels[i].bitrate <= bandwidth * 0.9) {
              targetLevel = i;
              break;
            }
          }
        }
      }
      const runningTime = Date.now() - startTime;
      if (
        runningTime > 30000 &&
        bandwidth > levels[levels.length - 1]?.bitrate * 0.7 &&
        avgBufferHealth > 10 &&
        targetLevel < levels.length - 1
      ) {
        targetLevel = levels.length - 1;
      }
      return targetLevel;
    };

    hls.on(hls.constructor.Events.FRAG_LOADED, (event, data) => {
      if (!isBlocked) {
        videoRef.current?.classList.remove("seeking");

        // Cập nhật bandwidth estimate
        if (data.stats && data.stats.loaded && data.stats.loading) {
          const loadTime = data.stats.loading.end - data.stats.loading.start;
          if (loadTime > 0) {
            const bandwidth = (data.stats.loaded * 8) / (loadTime / 1000);
            lastBandwidth = bandwidth;
          }
        }
      }
    });

    hls.on(hls.constructor.Events.LEVEL_SWITCHED, (event, data) => {
      if (!isBlocked) {
        const newResolution = hls.levels[data.level]?.height;
        setCurrentResolution(newResolution);

        // Update AUTO label
        const autoSpan = document.querySelector(
          ".plyr__menu__container [data-plyr='quality'][value='0'] span"
        );
        if (autoSpan && newResolution) {
          autoSpan.innerHTML = `Auto (${newResolution}p)`;
        } else if (autoSpan) {
          autoSpan.innerHTML = `Auto`;
        }

        // Đảm bảo video vẫn có thể play sau khi switch level
        if (videoRef.current && videoRef.current.readyState >= 2) {
          // Trigger một event nhỏ để đảm bảo player cập nhật trạng thái
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore promise rejection nếu video đã playing
            });
          }
        }
      }
    });

    hls.on(hls.constructor.Events.MANIFEST_PARSED, () => {
      if (!isBlocked) {
        const availableResolutions = hls.levels
          .map((level) => level.height)
          .filter(Boolean)
          .sort((a, b) => b - a);

        if (availableResolutions.length > 0) {
          // Set start level cao hơn
          const highQualityIndex = Math.floor(hls.levels.length * 0.8); // Bắt đầu ở 70% cao nhất
          hls.startLevel = highQualityIndex;
          cleanupPlayer();
          initializePlyrPlayer(availableResolutions);
        }
      }
    });

    // Smart level switching
    hls.on(hls.constructor.Events.BUFFER_APPENDED, () => {
      if (!isBlocked && hls.autoLevelEnabled && hls.media) {
        const currentLevel = hls.currentLevel;
        const bandwidth = hls.bandwidthEstimate || lastBandwidth;

        // Tính buffer length
        const bufferLength =
          hls.media.buffered.length > 0
            ? hls.media.buffered.end(0) - hls.media.currentTime
            : 0;

        const optimalLevel = getOptimalLevel(
          currentLevel,
          bandwidth,
          bufferLength
        );

        if (optimalLevel !== currentLevel && hls.autoLevelEnabled) {
          hls.nextLevel = optimalLevel;
        }
      }
    });

    hls.on(hls.constructor.Events.FRAG_LOADING, () => {
      if (!isBlocked && videoRef.current?.seeking) {
        videoRef.current.classList.add("seeking");
      }
    });

    hls.on(hls.constructor.Events.ERROR, (event, data) => {
      if (!isBlocked) {
        handleHLSError(hls, data);
      }
    });

    hls.on(hls.constructor.Events.LEVEL_SWITCHING, (event, data) => {
      if (!isBlocked && videoRef.current) {
        // Không pause video khi switching level
        // Chỉ thêm class để hiển thị loading nếu cần
        videoRef.current.classList.add("level-switching");
      }
    });

    hls.on(hls.constructor.Events.FRAG_PARSED, () => {
      if (!isBlocked && videoRef.current) {
        videoRef.current.classList.remove("level-switching");
      }
    });
  };

  const initializeHLSPlayer = async () => {
    if (isBlocked) return;

    try {
      const { default: Hls } = await import("hls.js");

      if (!Hls.isSupported()) {
        console.warn("HLS is not supported in this browser");
        return;
      }

      const CustomFragmentLoader = createCustomFragmentLoader(Hls);

      const hlsConfig = {
        ...getHLSConfig(),
        fLoader: CustomFragmentLoader,
      };

      const hls = new Hls(hlsConfig);

      hls.loadSource(m3u8Url);
      hls.attachMedia(videoRef.current);

      setupHLSEventHandlers(hls);

      hlsRef.current = hls;
    } catch (error) {
      console.error("Error initializing video player:", error);
    }
  };

  const cleanup = () => {
    if (securityDetectorRef.current) {
      securityDetectorRef.current.destroy();
      securityDetectorRef.current = null;
    }

    if (plyrRef.current) {
      try {
        plyrRef.current.destroy();
        plyrRef.current = null;
      } catch (error) {
        console.error("Error destroying Plyr:", error);
      }
    }

    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } catch (error) {
        console.error("Error destroying HLS:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanupPlayer(); // Cleanup khi unmount
    };
  }, []);

  // Effects
  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    initializeSecurity();

    return cleanup;
  }, [isClient, initializeSecurity]);

  useEffect(() => {
    if (!isClient || !videoRef.current || isBlocked) return;

    initializeHLSPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m3u8Url, isClient, isBlocked]);

  if (!isClient) {
    return <LoadingComponent />;
  }

  if (isBlocked) {
    return <BlockedComponent />;
  }

  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          controls
          className="video-player"
          crossOrigin="anonymous"
          playsInline
          autoPlay
          muted
          loop
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <VideoInfo currentResolution={currentResolution} />

      {/* Security overlay (invisible) */}
      <div onContextMenu={(e) => e.preventDefault()} />
    </div>
  );
};

// ===== SUB COMPONENTS =====
const LoadingComponent = () => (
  <div className="video-player-container">
    <div className="video-wrapper">
      <div className="video-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải video...</p>
        </div>
      </div>
    </div>
  </div>
);

const VideoInfo = ({ currentResolution }) => (
  <div className="video-info">
    {currentResolution ? `${currentResolution}p` : "Auto"}
  </div>
);

// ===== DYNAMIC IMPORT WRAPPER =====
const VideoPlayer = dynamic(() => Promise.resolve(VideoPlayerCore), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

// ===== MAIN EXPORT =====
export default VideoPlayer;
