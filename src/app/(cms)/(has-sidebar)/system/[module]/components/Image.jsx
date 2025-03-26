"use client";
import ImageCustom from "@/components/Maintain/Image";
import { showImageUrl } from "@/utils/client/util";
import { useEffect, useRef } from "react";

const ImageComponent = ({ value, item, field }) => {
  const imageRef = useRef(null);
  useEffect(() => {
    imageRef.current.src = showImageUrl(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div rs-preview={`${item._id}-${field.name}`} className="relative">
      <ImageCustom
        rs-preview-show={"true"}
        ref={imageRef}
        src={"/next.svg"}
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "80px",
          height: "80px",
          objectFit: "contain",
          cursor: "zoom-in",
        }}
        quality={100}
        alt={""}
      />
    </div>
  );
};

export default ImageComponent;
