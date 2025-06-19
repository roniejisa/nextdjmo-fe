"use client";

import { formatDateTwo, formatFileSize } from "@/utils/client";
import MediaItem from "./MediaItem";
import { mediaType } from "../lib";
import { useAutoMaxHeight } from "@/hooks/useAutoMaxHeight";

const ListView = ({
  medias,
  mediaItemRef,
  handleMouseDown,
  handleClick,
  handleDoubleClick,
  observerRef,
  viewMode,
}) => {
  useAutoMaxHeight(mediaItemRef, 3, [medias, mediaItemRef]);

  return (
    <div className="px-6 py-4">
      {/* List Header with Neumorphism */}
      <div
        className="grid grid-cols-12 gap-4 px-6 py-4 mb-4
        bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80
        backdrop-blur-xl backdrop-saturate-150
        rounded-2xl 
        border border-white/30
        shadow-[inset_0_2px_0_0_rgba(255,255,255,0.3),inset_0_-2px_0_0_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.06)]
        text-sm font-semibold text-gray-700/90"
      >
        <div className="col-span-6 md:col-span-5 flex items-center">
          <span className="drop-shadow-sm">Tên</span>
        </div>
        <div className="col-span-3 md:col-span-2 hidden sm:flex items-center">
          <span className="drop-shadow-sm">Kích thước</span>
        </div>
        <div className="col-span-3 md:col-span-2 hidden md:flex items-center">
          <span className="drop-shadow-sm">Loại</span>
        </div>
        <div className="col-span-3 hidden lg:flex items-center">
          <span className="drop-shadow-sm">Ngày sửa đổi</span>
        </div>
      </div>

      {/* List Content */}
      <section
        ref={mediaItemRef}
        className="space-y-2 select-none overflow-auto file-selector px-2"
        onMouseDown={handleMouseDown}
      >
        {medias?.map((media, index) => {
          let Component = mediaType[media.extension] || mediaType["default"];
          const infoData = media.file_info
            ? JSON.stringify(media.file_info)
            : {};
          return (
            <MediaItem
              viewMode={viewMode}
              key={`${media._id}-${index}`}
              {...media}
              className="item group 
                bg-gradient-to-r from-white/40 via-white/30 to-white/40
                backdrop-blur-lg backdrop-saturate-150
                rounded-xl 
                border border-white/20
                shadow-[0_4px_16px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]
                transition-all duration-300 ease-out
                hover:bg-gradient-to-r hover:from-white/60 hover:via-white/50 hover:to-white/60
                hover:border-white/40
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]
                hover:scale-[1.01] hover:-translate-y-0.5
                has-[input:checked]:bg-gradient-to-r has-[input:checked]:from-blue-50/60 has-[input:checked]:via-blue-100/40 has-[input:checked]:to-cyan-50/60
                has-[input:checked]:border-blue-300/40
                has-[input:checked]:shadow-[0_8px_32px_rgba(59,130,246,0.12),0_2px_8px_rgba(59,130,246,0.08)]
                active:scale-[0.99] active:translate-y-0"
              onClick={handleClick}
              index={index}
              onDoubleClick={(e) => handleDoubleClick(e, media)}
            >
              <input type="checkbox" hidden />
              <div className="grid grid-cols-12 gap-4 items-center p-4 relative z-10">
                {/* File Icon & Name */}
                <div className="col-span-6 md:col-span-5 flex items-center space-x-4 min-w-0">
                  <div
                    className="flex-shrink-0 w-10 h-10 
                    bg-gradient-to-br from-white/30 to-white/10
                    backdrop-blur-sm
                    rounded-xl 
                    border border-white/20
                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.08)]
                    flex items-center justify-center
                    group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_6px_20px_rgba(0,0,0,0.12)]
                    transition-all duration-200"
                  >
                    <Component media={media} />
                  </div>
                  <span
                    className="truncate text-sm font-medium text-gray-800/90 
                    drop-shadow-sm group-hover:text-blue-700 transition-colors duration-200"
                  >
                    {media.name || media.filename || "Unnamed"}
                  </span>
                </div>

                {/* File Size */}
                <div className="col-span-3 md:col-span-2 hidden sm:block text-sm text-gray-600/80 font-medium drop-shadow-sm">
                  {infoData?.size ? formatFileSize(infoData?.size) : "--"}
                </div>

                {/* File Type */}
                <div className="col-span-3 md:col-span-2 hidden md:block">
                  <span
                    className="inline-flex px-3 py-1 text-xs font-semibold uppercase
                    bg-gradient-to-r from-gray-100/60 to-gray-200/40
                    backdrop-blur-sm
                    text-gray-700/90
                    rounded-full
                    border border-white/30
                    shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_2px_8px_rgba(0,0,0,0.06)]
                    drop-shadow-sm"
                  >
                    {media.extension?.replace(".", "") || "Unknown"}
                  </span>
                </div>

                {/* Modified Date */}
                <div className="col-span-3 hidden lg:block text-sm text-gray-600/80 font-medium drop-shadow-sm">
                  {media.updatedAt ? formatDateTwo(media.updatedAt) : "--"}
                </div>
              </div>

              {/* Subtle inner highlight */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
            </MediaItem>
          );
        })}
        <span ref={observerRef} className="w-full block"></span>
      </section>
    </div>
  );
};

export default ListView;