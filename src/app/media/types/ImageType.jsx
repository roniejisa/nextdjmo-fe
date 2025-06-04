import React, { useEffect, useRef } from "react";
import { convertSize, showImageUrl } from "@/utils/client";
import { useMedia } from "../MediaProvider";
import Image from "next/image";
import ImageCustom from "@/components/Maintain/Image";
import { mediaOptions } from "./default";

const ImageType = ({ media }) => {
  const { filename, file_info, extention, _id } = media;
  let fileInfo = file_info;
  if (typeof file_info === "string") {
    fileInfo = JSON.parse(file_info.replaceAll("'", '"')) ?? {};
  }
  const { size } = fileInfo;
  const { setEditorImage, setMenuPosition, setListComponent, callbackMenu } =
    useMedia((data) => {
      return data;
    });
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
                url: showImageUrl(media, false),
                filename,
                fileInfo,
                extention,
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
    const offMenuContext = () => setMenuPosition(null);
    window.addEventListener("click", offMenuContext);
    return () => window.removeEventListener("click", offMenuContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="rounded-md" onContextMenu={handleShowContextMenu}>
      <ImageCustom
        ref={imageRef}
        src={showImageUrl(media)}
        fill={true}
        title={media?.filename ?? media?.name}
        className="rounded-lg object-contain shadow-[0_0_5px_1px_rgba(0,0,0,.2)]"
        sizes="100vw"
        alt="image"
      />
    </div>
  );
};

export default ImageType;
