import { convertSize, showImageUrl } from "@/utils/client";
import React, { useEffect, useRef } from "react";
import { mediaOptions } from "./default";
import ImageCustom from "@/components/Maintain/Image";
import { useMediaStore } from "@/stories/files/mediaStore";

const VideoType = ({ media }) => {
  const { filename, url, file_info, extension, _id } = media;
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { setMenuPosition, setListComponent, callbackMenu } = useMediaStore(state => state)
  const { size } = fileInfo;
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      // Khi video được tải xong metadata
      videoElement.onloadeddata = () => {
        // Kiểm tra xem video đã đủ dữ liệu để seek chưa
        if (videoElement.duration > 0 && videoElement.currentTime === 0) {
          videoElement.currentTime = Math.floor(videoElement.duration / 2);
        } else {
        }
      };

      // Khi video được "seeked" đến thời gian mong muốn
      videoElement.onseeked = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        // Vẽ video lên canvas
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Lấy hình ảnh từ canvas
        const dataURL = canvas.toDataURL("image/png");
        imageRef.current.src = dataURL;
      };

      // Khi video được "seeked" đến thời gian mong muốn
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowContextMenu = (e) => {
    e.preventDefault();

    setMenuPosition(null);
    const { clientX, clientY } = e.nativeEvent;
    setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setListComponent([...mediaOptions(_id, callbackMenu)]);
    }, 200);
  };

  return (
    <div className="rounded-md" onContextMenu={handleShowContextMenu}>
      <video
        ref={videoRef}
        crossOrigin="anonymous"
        src={showImageUrl(media)}
        style={{ display: "none" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <ImageCustom
        ref={imageRef}
        src={"/next.svg"}
        fill={true}
        className="rounded-lg object-contain shadow-[0_0_5px_1px_rgba(0,0,0,.2)]"
        sizes="100vw"
        alt="image"
      />

      <div className="absolute bottom-0 rounded-lg bg-black px-2 w-full">
        <p className="line-clamp-1 text-white">{filename}</p>
        {size ? (
          <p className="line-clamp-1 text-gray-500">{convertSize(size)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default VideoType;
