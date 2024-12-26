"use client";
import Image from "next/image";
import { GalleryContext } from "@/context/ImageProvider";
import { useContext, useEffect, useId, useRef } from "react";
import { showImageUrl } from "@/utils/client/util";

const ImageComponent = ({
  defaultValue,
  fnChooseImage,
  attrName,
  attrValue,
}) => {
  const { setShowMedia, itemCurrent, setItemCurrent, choosed, isMultiple } =
    useContext(GalleryContext);
  const imageRef = useRef(null);
  const id = useId();
  const handleShowUpload = () => {
    setShowMedia(id);
  };

  useEffect(() => {
    if (isMultiple) return;
    const index = itemCurrent.findIndex((item) => item.id == id);
    if (index !== -1) {
      imageRef.current.src = showImageUrl(itemCurrent[index]?.data);
      fnChooseImage(
        JSON.stringify(itemCurrent[index]?.data),
        attrName,
        attrValue
      );
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCurrent, choosed]);

  useEffect(() => {
    let itemCurrent;
    try {
      itemCurrent = JSON.parse(defaultValue || "");
    } catch (e) {
      itemCurrent = null;
    }
    if (itemCurrent) {
      setItemCurrent((prev) => {
        const index = prev.findIndex((item) => item.id == id);
        if (index !== -1) {
          prev[index].data = itemCurrent;
        } else {
          prev.push({ id, data: itemCurrent });
        }
        return [...prev];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
  return (
    <div className="relative">
      <div
        className="group w-[60px] h-[60px] cursor-pointer group"
        onClick={handleShowUpload}
      >
        <Image
          ref={imageRef}
          src={
            itemCurrent.find((item) => item.id == id)
              ? process.env.NEXT_PUBLIC_ENDPOINT_URL +
                itemCurrent.find((item) => item.id == id).data.url
              : "/next.svg"
          }
          height={0}
          width={0}
          className="absolute border border-dashed border-blue-400 top-0 left-0 object-contain px-2"
          style={{ width: "100%", height: "100%" }}
          alt={attrValue}
        />
        <button
          type="button"
          className="group-hover:opacity-100 w-10 h-10 opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 border border-blue-500 border-dashed transition text-2xl"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ImageComponent;
