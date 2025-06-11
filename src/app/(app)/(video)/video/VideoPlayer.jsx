"use client";
import "plyr/dist/plyr.css";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CryptoJS from "crypto-js";

// ===== UTILITY FUNCTIONS =====
/**
 * Tạo số từ giờ hiện tại (1-9, 0 thành 1)
 */
const getCurrentHourNumber = () => {
  const result = new Date().getHours() % 10 || 1;
  return result;
};

/**
 * Lấy tên thứ trong tuần bằng tiếng Việt
 */
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

/**
 * Tạo MD5 hash từ giờ hiện tại và thứ trong tuần
 */
const createTimeBasedMD5 = () => {
  const hashString = getCurrentHourNumber().toString() + getVietnameseDayName();
  const md5Hash = CryptoJS.MD5(hashString).toString();
  return md5Hash;
};

// ===== DECRYPTION HELPER =====
/**
 * Giải mã dữ liệu video từ base64
 */
const decryptVideoData = (encryptedData) => {
  const hourNumber = getCurrentHourNumber();
  const md5Hash = createTimeBasedMD5();

  // Thay thế các ký tự mã hóa
  const cleanedData = encryptedData
    .replaceAll(md5Hash, hourNumber)
    .replaceAll("/kopwefd", "H")
    .replaceAll("ixgrgfd/", "D");

  // Decode base64 thành ArrayBuffer
  const binaryString = atob(cleanedData);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return arrayBuffer;
};

// ===== HLS CONFIGURATION =====
/**
 * Cấu hình HLS
 */
const getHLSConfig = () => ({
  enableWorker: true,
  lowLatencyMode: true,
  maxBufferLength: 60,
  maxMaxBufferLength: 300,
  maxBufferSize: 60 * 1000 * 1000,
  maxBufferHole: 0.1,
  debug: false,
  fragLoadingTimeOut: 20000,
  fragLoadingMaxRetry: 4,
  fragLoadingRetryDelay: 1000,
  manifestLoadingTimeOut: 10000,
  manifestLoadingMaxRetry: 1,
});

// ===== PLYR CONFIGURATION =====
/**
 * Cấu hình Plyr player
 */
const getPlyrConfig = (availableResolutions, onQualityChange) => ({
  quality: {
    default: "auto", // Thay đổi từ availableResolutions[0] thành "auto"
    options: ["auto", ...availableResolutions],
    forced: true,
    onChange: onQualityChange,
  },
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "settings",
    "fullscreen",
    "loop",
  ],
  settings: ["quality", "speed", "loop"],
  speed: {
    selected: 1,
    options: [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4],
  },
  autoplay: true, // Thêm autoplay
  loop: { active: false }, // Thêm loop config
});

// ===== MAIN COMPONENT =====
const VideoPlayerCore = ({ m3u8Url }) => {
  // State
  const [currentResolution, setCurrentResolution] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);

  /**
   * Xử lý thay đổi độ phân giải
   */
  const handleResolutionChange = (newQuality) => {
    if (!hlsRef.current || !videoRef.current) return;

    if (newQuality === "auto") {
      // Bật auto quality
      hlsRef.current.currentLevel = -1; // -1 = auto mode
      console.log("Auto quality enabled");
    } else {
      const levelIndex = hlsRef.current.levels.findIndex(
        (level) => level.height === parseInt(newQuality)
      );

      if (levelIndex !== -1) {
        const currentTime = videoRef.current.currentTime || 0;
        hlsRef.current.currentLevel = levelIndex;

        if (currentTime > 0) {
          hlsRef.current.startLoad(currentTime);
        }

        console.log(`Resolution changed to: ${newQuality}p`);
      }
    }
  };

  /**
   * Tạo Custom Fragment Loader (giữ nguyên cấu trúc gốc)
   */
  const createCustomFragmentLoader = (Hls) => {
    class CustomFragmentLoader extends Hls.DefaultConfig.loader {
      constructor(config) {
        super(config);
      }

      load(context, config, callbacks) {
        const { url } = context;

        // Chỉ xử lý custom cho video segments từ API
        if (url.includes("/api/video/")) {
          this.loadCustomSegment(url, context, config, callbacks);
        } else {
          // Sử dụng loader mặc định cho các file khác (manifest, etc.)
          super.load(context, config, callbacks);
        }
      }

      async loadCustomSegment(url, context, config, callbacks) {
        try {
          // Gọi API để lấy dữ liệu encrypted
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

          // Giải mã dữ liệu
          const decodedData = decryptVideoData(jsonData.data);

          // Tạo response object cho HLS
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

          // Gọi callback success
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

      abort() {
        // Implement abort logic nếu cần
      }

      destroy() {
        // Cleanup logic nếu cần
      }
    }

    return CustomFragmentLoader;
  };

  /**
   * Xử lý lỗi HLS
   */
  const handleHLSError = (hls, data) => {
    if (data.fatal) {
      switch (data.type) {
        case hls.constructor.ErrorTypes.NETWORK_ERROR:
          console.log("Attempting to recover from network error");
          hls.startLoad();
          break;
        case hls.constructor.ErrorTypes.MEDIA_ERROR:
          console.log("Attempting to recover from media error");
          hls.recoverMediaError();
          break;
        default:
          console.error("Fatal error, cannot recover:", data);
          hls.destroy();
          break;
      }
    }
  };

  /**
   * Khởi tạo Plyr player
   */
  const initializePlyrPlayer = async (availableResolutions) => {
    if (!plyrRef.current && videoRef.current) {
      const { default: Plyr } = await import("plyr");
      const player = new Plyr(
        videoRef.current,
        getPlyrConfig(availableResolutions, handleResolutionChange)
      );
      plyrRef.current = player;
    }
  };

  /**
   * Setup các event handlers cho HLS
   */
  const setupHLSEventHandlers = (hls) => {
    // Khi resolution thay đổi
    hls.on(hls.constructor.Events.LEVEL_SWITCHED, (event, data) => {
      const newResolution = hls.levels[data.level]?.height;
      setCurrentResolution(newResolution);
    });

    // Khi manifest được parse
    // Khi manifest được parse
    hls.on(hls.constructor.Events.MANIFEST_PARSED, () => {
      const availableResolutions = hls.levels
        .map((level) => level.height)
        .filter(Boolean)
        .sort((a, b) => b - a);

      if (availableResolutions.length > 0) {
        hls.startLevel = -1; // Thay đổi thành -1 để bắt đầu với auto
        initializePlyrPlayer(availableResolutions);
      }
    });

    // Xử lý loading states
    hls.on(hls.constructor.Events.FRAG_LOADING, () => {
      if (videoRef.current?.seeking) {
        videoRef.current.classList.add("seeking");
      }
    });

    hls.on(hls.constructor.Events.FRAG_LOADED, () => {
      videoRef.current?.classList.remove("seeking");
    });

    // Xử lý errors
    hls.on(hls.constructor.Events.ERROR, (event, data) => {
      handleHLSError(hls, data);
    });

    // Xử lý level switching
    hls.on(hls.constructor.Events.LEVEL_SWITCHING, (event, data) => {
      console.log(`Switching to level: ${data.level}`);
      hls.trigger("hlsBufferFlushing");
    });
  };

  /**
   * Khởi tạo HLS player
   */
  const initializeHLSPlayer = async () => {
    try {
      const { default: Hls } = await import("hls.js");

      if (!Hls.isSupported()) {
        console.warn("HLS is not supported in this browser");
        return;
      }

      // Tạo custom loader
      const CustomFragmentLoader = createCustomFragmentLoader(Hls);

      // Tạo HLS instance với custom loader
      const hlsConfig = {
        ...getHLSConfig(),
        fLoader: CustomFragmentLoader, // Sử dụng custom loader
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

  /**
   * Cleanup resources
   */
  const cleanup = () => {
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

  // Effects
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    initializeHLSPlayer();

    return cleanup;
  }, [m3u8Url, isClient]);

  // Render loading state
  if (!isClient) {
    return <LoadingComponent />;
  }

  // Render main component
  return (
    <div className="video-player-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          controls
          className="video-player"
          style={{ width: "100%", height: "auto" }}
          crossOrigin="anonymous"
          playsInline
          autoPlay // Thêm autoPlay
          loop // Thêm loop
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <VideoInfo currentResolution={currentResolution} />
    </div>
  );
};

// ===== SUB COMPONENTS =====
/**
 * Component hiển thị trạng thái loading
 */
const LoadingComponent = () => (
  <div className="video-player-container">
    <div className="video-wrapper">
      <div
        className="video-loading"
        style={{
          width: "100%",
          height: "400px",
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Loading video player...
      </div>
    </div>
  </div>
);

/**
 * Component hiển thị thông tin video
 */
const VideoInfo = ({ currentResolution }) => (
  <div className="video-info" style={{ marginTop: "10px", padding: "10px" }}>
    <div className="resolution-info">
      <strong>Current Resolution:</strong>{" "}
      {currentResolution ? `${currentResolution}p` : "Loading..."}
    </div>
  </div>
);

// ===== DYNAMIC IMPORT =====
const VideoPlayer = dynamic(() => Promise.resolve(VideoPlayerCore), {
  ssr: false,
  loading: () => (
    <div className="video-player-container">
      <div className="video-wrapper">
        <div
          style={{
            width: "100%",
            height: "400px",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading video player...
        </div>
      </div>
    </div>
  ),
});

export default VideoPlayer;
