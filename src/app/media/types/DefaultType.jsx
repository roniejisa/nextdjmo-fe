import Image from "next/image";
import React, { useRef } from "react";
import { convertSize, showImageUrl } from "@/utils/client";
import { useMedia } from "../MediaProvider";
import { mediaOptions } from "./default";
import File from "@/components/Icon/svg/File";

const DefaultType = ({ media }) => {
  const { filename, url, file_info, extention, _id } = media;
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { size } = fileInfo;

  const { setMenuPosition, setListComponent } = useMedia((data) => data);

  const handleShowContextMenu = (e) => {
    e.preventDefault();

    setMenuPosition(null);
    const { clientX, clientY } = e.nativeEvent;
    setTimeout(() => {
      setMenuPosition({ x: clientX, y: clientY });
      setListComponent([...mediaOptions(_id)]);
    }, 200);
  };
  return (
    <div className="rounded-md" onContextMenu={handleShowContextMenu}>
      <File className="w-full h-full absolute top-0 left-0" />
      <div className="absolute bottom-0 rounded-lg bg-black px-2 w-full">
        <p className="line-clamp-1 text-white">{filename}</p>
        {size ? (
          <p className="line-clamp-1 text-gray-500">{convertSize(size)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default DefaultType;
