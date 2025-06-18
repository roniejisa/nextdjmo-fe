"use client";

import { mediaType } from "../lib";
import MediaItem from "./MediaItem";

const GridView = ({
  medias,
  mediaItemRef,
  handleMouseDown,
  handleClick,
  handleDoubleClick,
  observerRef,
  viewMode
}) => {
  return (
    <section
      ref={mediaItemRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 px-4 py-4 select-none gap-x-4 gap-y-8 overflow-auto file-selector content-start"
      onMouseDown={handleMouseDown}
    >
      {medias?.map((media, index) => {
        let Component = mediaType[media.extension] || mediaType["default"];
        return (
          <MediaItem
            viewMode={viewMode}
            key={`${media._id}-${index}`}
            {...media}
            className="item group relative bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105 hover:bg-white/80 has-[input:checked]:ring-2 has-[input:checked]:ring-blue-400 has-[input:checked]:bg-blue-50/80 has-[input:checked]:shadow-lg"
            onClick={handleClick}
            index={index}
            onDoubleClick={(e) => handleDoubleClick(e, media)}
          >
            <input type="checkbox" hidden />
            <div className="">
              <Component media={media} />
              <p className="line-clamp-1">{media?.filename ?? media?.name}</p>
            </div>
          </MediaItem>
        );
      })}
      <span ref={observerRef} className="w-full col-span-full"></span>
    </section>
  );
};

export default GridView;