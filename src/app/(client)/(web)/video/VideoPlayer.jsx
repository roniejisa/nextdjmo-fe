"use client";
import "plyr/dist/plyr.css"; // Đảm bảo bạn đã import CSS của Plyr
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr"; // Plyr.js

function removeSecretFromData(data, secret) {
  const secretBytes = new TextEncoder().encode(secret);
  const dataStart = data.slice(0, secretBytes.length);
  const dataEnd = data.slice(-secretBytes.length);

  if (JSON.stringify(dataStart) === JSON.stringify(secretBytes)) {
    return data.slice(secretBytes.length);
  }

  if (JSON.stringify(dataEnd) === JSON.stringify(secretBytes)) {
    return data.slice(0, -secretBytes.length);
  }

  return data;
}

const VideoPlayer = ({ m3u8Url }) => {
  const videoRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState(null); // Resolution hiện tại đang phát
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr, url) => {
          xhr.setRequestHeader("x-api-key", "123456"); // Thêm API key nếu cần
        },
      });

      hls.loadSource(m3u8Url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.FRAG_LOADING, async (event, data) => {
        try {
          const response = await fetch(data.frag.url);
          const encryptedData = await response.arrayBuffer();
          console.log("Encrypted data received:", encryptedData);

          const secret = "\x00\x00\x00\x00\x00";
          const decryptedData = removeSecretFromData(
            new Uint8Array(encryptedData),
            secret
          );

          const blob = new Blob([decryptedData], { type: "video/mp2t" });
          const url = URL.createObjectURL(blob);

          data.frag.url = url;
          console.log("Decrypted data URL:", url);
        } catch (error) {
          console.error("Failed to load or decrypt fragment:", error);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        // Cập nhật độ phân giải hiện tại khi chuyển cấp độ
        setCurrentResolution(hls.levels[data.level].height);
        console.log(
          "Current level switched to:",
          hls.levels[data.level].height
        );
      });

      // Khi manifest được tải
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        const availableResolutions = hls.levels.map((level) => level.height);

        if (availableResolutions.length > 0) {
          hls.startLevel = availableResolutions.length - 1; // Đổi chất lượng video tốt nhất
        }
        if (!plyrRef.current && videoRef.current) {
          const player = new Plyr(videoRef.current, {
            quality: {
              default: availableResolutions[availableResolutions.length - 1],
              options: availableResolutions.sort((a, b) => b - a),
              forced: true,
              onChange: (event) => handleChangeResolution(event),
            },
          });
          plyrRef.current = player;
        }
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("A network error occurred.");
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("A media error occurred.");
              break;
            case Hls.ErrorTypes.OTHER_ERROR:
              console.error("An unknown error occurred.");
              break;
            default:
              console.error("An error occurred.");
              break;
          }
        }
      });
      hlsRef.current = hls;
      return () => {
        hls.destroy();
      };
    }
  }, [m3u8Url]);

  const handleChangeResolution = (event) => {
    // Tìm index của độ phân giải trong danh sách levels
    const levelIndex = hlsRef.current.levels
      .map((level) => level.height)
      .findIndex((resolution) => resolution == event);
    console.log(levelIndex);
    if (hlsRef.current) {
      // Đặt độ phân giải của HLS.js
      hlsRef.current.currentLevel = levelIndex;
    }
  };

  return (
    <div>
      <video ref={videoRef} controls width="100%">
        Your browser does not support the video tag.
      </video>
      <div>
        <p>
          Current Resolution:{" "}
          {currentResolution ? `${currentResolution}p` : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
