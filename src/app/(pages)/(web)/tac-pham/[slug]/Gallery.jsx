"use client";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";
import React, { useRef } from "react";

const Gallery = ({ data }) => {
  let listImage = [];
  const indexRef = useRef(0);
  const listImageRef = useRef(null);
  const imageRef = useRef(null)
  try {
    listImage = JSON.parse(data.images) || [];
  } catch (e) {}
  listImage.unshift(data.image);
  return (
    <div className="flex">
      <div className="h-[400px] overflow-auto flex flex-col gap-4" ref={listImageRef}>
        {listImage.map((item, index) => {
          return (
            <Image
              key={index}
              src={showImageUrl(item)}
              alt={data.name}
              index={index}
              width={80}
              height={60}
              className="object-contain cursor-pointer"
            />
          );
        })}
      </div>
      <div>
        <Image
          src={showImageUrl(data.image)}
          alt={data.name}
          width={400}
          height={400}
        />
      </div>
    </div>
  );
};

export default Gallery;
