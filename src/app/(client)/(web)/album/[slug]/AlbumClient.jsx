"use client";

import MouseEffect from "@/components/Mouse/MouseEffect";
import PreviewItem from "@/packages/previews/PreviewItem";
import { PreviewContext } from "@/packages/previews/PreviewProvider";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import { useContext } from "react";

const AlbumClient = ({ images }) => {
  const { previewIndex } = useContext(PreviewContext);
  return (
    <div
      className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4"
      rs-preview={"true"}
    >
      {images?.map((item, index) => (
        <PreviewItem
          className="relative pt-[100%]"
          key={index}
          index={index}
          item={item}
        >
          <div className="overflow-hidden absolute top-0 left-0 w-full h-full">
            <Image
              fill={true}
              className="object-cover hover:scale-125 transition hover:z-[999] duration-500 ease-in-out"
              src={showImageUrl(item)}
              alt={item.name}
            />
          </div>
        </PreviewItem>
      ))}
      <MouseEffect dependencies={{ previewIndex }} />
    </div>
  );
};

export default AlbumClient;
