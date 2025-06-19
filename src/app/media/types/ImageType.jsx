"use client"
import React, { useEffect, useRef } from "react";
import { showImageUrl } from "@/utils/client";
import ImageCustom from "@/components/Maintain/Image";
import { mediaOptions } from "./default";
import { useMediaStore } from "@/stories/files/mediaStore";
import { useCallbackMenu } from "@/hooks/files/useCallbackMenu";
import { useNotify } from "@/context/NotifyProvider";

const ImageType = ({ media }) => {
  const { filename, file_info, extension, _id } = media;
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { size } = fileInfo;
  const { setEditorImage, setMenuPosition, setListComponent } = useMediaStore((state) => state);
  const notify = useNotify()
  const callbackMenu = useCallbackMenu(notify)
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleShowContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn event bubble up

    setMenuPosition(null);
    const { clientX, clientY } = e.nativeEvent;
    setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setListComponent([
        {
          text: "Chỉnh sửa",
          attribute: {
            onClick: () =>
              setEditorImage({
                url: showImageUrl(media, false),
                filename,
                fileInfo,
                extension,
                _id,
                imageRef,
              }),
          },
        },
        ...mediaOptions(_id, callbackMenu),
      ]);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Kiểm tra xem click có phải từ bên ngoài component không
      // và không phải click vào menu (menu thường có class hoặc data attribute đặc biệt)
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Kiểm tra thêm xem có phải click vào menu không
        const isMenuClick = e.target.closest('[data-menu]') || 
                           e.target.closest('.menu') || 
                           e.target.closest('[role="menu"]');
        
        if (!isMenuClick) {
          setMenuPosition(null);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setMenuPosition]);
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 rounded-2xl overflow-hidden w-full h-full
        bg-gradient-to-br from-white/20 via-gray-50/10 to-white/30
        backdrop-blur-sm
        border border-white/40
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_6px_20px_rgba(0,0,0,0.1)]
        group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_12px_32px_rgba(0,0,0,0.15)]
        transition-all duration-300" 
      onContextMenu={handleShowContextMenu}>
      <div className="absolute inset-1 rounded-xl overflow-hidden
        shadow-[0_4px_16px_rgba(0,0,0,0.12)]
        group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]
        transition-all duration-300">
        <ImageCustom
          ref={imageRef}
          src={showImageUrl(media)}
          fill={true}
          title={media?.filename ?? media?.name}
          className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="100vw"
          alt="image"
        />
      </div>
      
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none"></div>
      
      {/* Subtle inner border */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
    </div>
  );
};

export default ImageType;