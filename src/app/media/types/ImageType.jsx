import Image from "next/image";
import React, { useRef, useState } from "react";
import MediaItem from "../MediaItem";
import { convertSize } from "@/utils/client/util";
import { useMedia } from "../MediaProvider";
import { mediaOptions } from "./default";

const ImageType = ({ filename, url, file_info, extention, _id }) => {
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { size } = fileInfo;
  const { setEditorImage, menuPosition, setMenuPosition, setListComponent } =
    useMedia((data) => data);
  
  const imageRef = useRef(null);

  const handleShowContextMenu = (e) => {
    e.preventDefault();

    setMenuPosition(null);
    const { clientX, clientY } = e.nativeEvent;
    setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setListComponent([
        {
          text: "Chỉnh sửa",
          attribute: {
            onClick: () =>
              setEditorImage({
                url,
                filename,
                fileInfo,
                extention,
                _id,
                imageRef,
              }),
          },
        },
        ...mediaOptions(_id),
      ]);
    }, 200);
  };

  return (
    <div className="relative" onContextMenu={handleShowContextMenu}>
      <Image
        ref={imageRef}
        src={process.env.NEXT_PUBLIC_ENDPOINT_URL + url}
        width={0}
        height={0}
        className="w-auto h-[160px] object-contain mx-auto"
        sizes="100vw"
        alt="image"
      />
      <div className="absolute bottom-0 rounded-lg bg-[#00000040] px-2 w-full">
        <p className="line-clamp-1 text-white">{filename}</p>
        {size ? (
          <p className="line-clamp-1 text-white">{convertSize(size)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default ImageType;
