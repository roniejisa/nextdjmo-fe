"use client";
import "plyr/dist/plyr.css"; // Đảm bảo bạn đã import CSS của Plyr
import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr"; // Plyr.js

// Hàm chuẩn hóa IV (đảm bảo IV có độ dài 16 byte)
function normalizeIV(iv) {
  const requiredLength = 16; // Đảm bảo IV luôn có độ dài 16 byte
  let ivBuffer = iv; // Giả sử iv đã là ArrayBuffer hoặc Uint8Array

  // Kiểm tra chiều dài của IV và chuẩn hóa
  if (ivBuffer.byteLength < requiredLength) {
    const padding = new Uint8Array(requiredLength - ivBuffer.byteLength);
    ivBuffer = new Uint8Array([...new Uint8Array(ivBuffer), ...padding]);
  } else if (ivBuffer.byteLength > requiredLength) {
    ivBuffer = ivBuffer.slice(0, requiredLength); // Cắt bớt nếu IV dài hơn 16 byte
  }

  return ivBuffer;
}

// Hàm giải mã với Web Crypto API
async function decryptDataWithWebCrypto(encryptedData, key, iv) {
  // Key và IV đều đã được chuẩn bị sẵn, bạn chỉ cần sử dụng để giải mã.

  try {
    // Giải mã dữ liệu sử dụng AES trong chế độ CBC
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv: iv,
      },
      await crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, [
        "decrypt",
      ]),
      encryptedData // Dữ liệu mã hóa đã có sẵn
    );

    // Trả về dữ liệu giải mã dưới dạng ArrayBuffer
    return decryptedData;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

// Hàm chuyển chuỗi hex thành ArrayBuffer
function hexToArrayBuffer(hex) {
  const typedArray = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    typedArray[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return typedArray.buffer;
}

const VideoPlayer = ({ m3u8Url }) => {
  const videoRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState(null); // Resolution hiện tại đang phát
  const hlsRef = useRef(null);
  const plyrRef = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr, url) => {
          xhr.setRequestHeader("x-api-key", "123456"); // Thêm API key nếu cần
        },
      });

      hls.loadSource(m3u8Url);
      hls.attachMedia(videoRef.current);

      // hls.on(Hls.Events.FRAG_LOADING, async (event, data) => {
      //   // try {
      //   const response = await fetch(data.frag.url);
      //   const encryptedData = await response.arrayBuffer(); // Lấy dữ liệu mã hóa từ video
      //   const iv = response.headers.get("X-IV"); // Lấy IV từ header "X-IV"
      //   const key = response.headers.get("X-Key"); // Lấy key từ header "X-KEY"

      //   // Chuyển IV và key sang ArrayBuffer nếu cần
      //   const ivBuffer = hexToArrayBuffer(iv);
      //   const keyBuffer = hexToArrayBuffer(key);

      //   // Giải mã dữ liệu
      //   const decryptedData = await decryptDataWithWebCrypto(
      //     encryptedData,
      //     keyBuffer,
      //     ivBuffer
      //   );
      //   console.log("Decrypted data:", decryptedData);
      //   const blob = new Blob([decryptedData], {
      //     type: "video/MP2T", // Kiểm tra MIME type
      //   });

      //   const url = URL.createObjectURL(blob);

      //   // Kiểm tra xem URL có hợp lệ không trước khi gán
      //   if (url) {
      //     data.frag.url = url;
      //     console.log("Decrypted data URL:", url);
      //   } else {
      //     console.error("Failed to create Blob URL");
      //   }
      //   // } catch (error) {
      //   //   console.error("Failed to load or decrypt fragment:", error);
      //   // }
      // });

      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        // Cập nhật độ phân giải hiện tại khi chuyển cấp độ
        setCurrentResolution(hls.levels[data.level].height);
        // console.log(
        //   "Current level switched to:",
        //   hls.levels[data.level].height
        // );
      });

      // Khi manifest được tải
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if(!hls.levels) return
        const availableResolutions = hls.levels?.map((level) => level.height);
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
    if(!hlsRef.current.levels) return
    const levelIndex = hlsRef.current.levels
      ?.map((level) => level.height)
      .findIndex((resolution) => resolution == event);
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
