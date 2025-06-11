"use client";
import "plyr/dist/plyr.css";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CryptoJS from "crypto-js";

const createStringNumberLastHour = () => {
  const result = new Date().getHours() % 10 || 1;
  return result;
};

const getVNDay = () => {
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const dayIndex = new Date().getDay(); // 0=Sunday, 6=Saturday
  const dayVietnamese = days[dayIndex];
  return dayVietnamese;
};

const createMD5 = () => {
  const strHash = createStringNumberLastHour().toString() + getVNDay();
  const md5Hash = CryptoJS.MD5(strHash).toString();
  return md5Hash;
};

const VideoPlayerCore = ({ m3u8Url }) => {
  const videoRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;

    const initializePlayer = async () => {
      try {
        const [{ default: Hls }, { default: Plyr }] = await Promise.all([
          import("hls.js"),
          import("plyr"),
        ]);

        if (!Hls.isSupported()) {
          console.warn("HLS is not supported in this browser");
          return;
        }

        // Custom loader để xử lý encrypted segments
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
              // console.log('Loading custom segment:', url);

              const response = await fetch(url, {
                method: "GET",
                headers: {
                  "X-API-KEY": "123456",
                  "Content-Type": "application/json",
                },
                cache: "no-cache",
              });

              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${response.statusText}`
                );
              }

              const jsonData = await response.json();

              if (!jsonData.data) {
                throw new Error("No video data in response");
              }

              const hourCurrent = createStringNumberLastHour();
              const md5 = createMD5();
              // Decode base64 thành ArrayBuffer
              const base64Data = jsonData.data
                .replaceAll(md5, hourCurrent)
                .replaceAll("/kopwefd", "H")
                .replaceAll("ixgrgfd/", "D");
                
              const binaryString = atob(base64Data);
              const arrayBuffer = new ArrayBuffer(binaryString.length);
              const uint8Array = new Uint8Array(arrayBuffer);

              for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
              }

              // console.log('Decoded segment size:', arrayBuffer.byteLength);

              // Tạo response object giống như XMLHttpRequest
              const customResponse = {
                url: url,
                data: arrayBuffer,
                status: 200,
                statusText: "OK",
                headers: {
                  "content-type": "video/mp2t",
                  "content-length": arrayBuffer.byteLength.toString(),
                },
              };

              // Gọi callback success
              callbacks.onSuccess(customResponse, { url }, context);
            } catch (error) {
              console.error("Custom loader error:", error);

              // Gọi callback error
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
            // console.log('Aborting custom loader');
          }

          destroy() {
            // Cleanup logic nếu cần
            // console.log('Destroying custom loader');
          }
        }

        const hls = new Hls({
          // Sử dụng custom loader
          fLoader: CustomFragmentLoader,

          // Các config khác
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,

          // Thêm config cho debugging
          debug: false,

          // Config cho fragment loading
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 4,
          fragLoadingRetryDelay: 1000,

          // Config cho manifest loading
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 1,
        });

        hls.loadSource(m3u8Url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const newResolution = hls.levels[data.level]?.height;
          setCurrentResolution(newResolution);
          // console.log(`Resolution switched to: ${newResolution}p`);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const availableResolutions = hls.levels
            .map((level) => level.height)
            .filter(Boolean)
            .sort((a, b) => b - a);

          // console.log("Available resolutions:", availableResolutions);

          if (availableResolutions.length > 0) {
            hls.startLevel = hls.levels.length - 1;

            if (!plyrRef.current && videoRef.current) {
              const player = new Plyr(videoRef.current, {
                quality: {
                  default: availableResolutions[0],
                  options: availableResolutions,
                  forced: true,
                  onChange: handleChangeResolution,
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
                ],
                settings: ["quality", "speed"],
                speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
              });

              plyrRef.current = player;
            }
          }
        });

        hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
          // console.log("Fragment loading:", data.frag.url);
        });

        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          // console.log("Fragment loaded successfully:", data.frag.url);
        });

        hls.on(Hls.Events.FRAG_LOAD_ERROR, (event, data) => {
          // console.error("Fragment load error:", data);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          // console.error("HLS Error:", data.type, data.details, data);

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // console.log("Attempting to recover from network error");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                // console.log("Attempting to recover from media error");
                hls.recoverMediaError();
                break;
              default:
                // console.error("Fatal error, cannot recover:", data);
                hls.destroy();
                break;
            }
          }
        });

        hlsRef.current = hls;
      } catch (error) {
        console.error("Error initializing video player:", error);
      }
    };

    initializePlayer();

    return () => {
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
  }, [m3u8Url, isClient]);

  const handleChangeResolution = (newQuality) => {
    if (!hlsRef.current) return;

    const levelIndex = hlsRef.current.levels.findIndex(
      (level) => level.height === parseInt(newQuality)
    );

    if (levelIndex !== -1) {
      hlsRef.current.currentLevel = levelIndex;
      // console.log(`Resolution changed to: ${newQuality}p`);
    }
  };

  if (!isClient) {
    return (
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
  }

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
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div
        className="video-info"
        style={{ marginTop: "10px", padding: "10px" }}
      >
        <div className="resolution-info">
          <strong>Current Resolution:</strong>{" "}
          {currentResolution ? `${currentResolution}p` : "Loading..."}
        </div>
      </div>
    </div>
  );
};

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
