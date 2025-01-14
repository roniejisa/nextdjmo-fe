"use client";
import ImageCustom from "@/components/Maintain/Image";
import PreviewProvider from "@/packages/previews/PreviewProvider";
import { useEffect, useRef } from "react";

const ImageComponent = ({ value, item, field }) => {
  const imageRef = useRef(null);
  useEffect(() => {
    let imageCurrent;
    try {
      imageCurrent =
        value && typeof value === "string" ? JSON.parse(value) : null;
    } catch (error) {
      imageCurrent = null;
    }
    if (imageCurrent) {
      imageRef.current.src =
        process.env.NEXT_PUBLIC_ENDPOINT_URL + imageCurrent.url;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="relative">
        <ImageCustom
          rs-preview="true"
          ref={imageRef}
          src={"/next.svg"}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "80px", height: "80px", objectFit: "contain" }}
          quality={100}
          alt={""}
        />
    </div>
  );
};

export default ImageComponent;
