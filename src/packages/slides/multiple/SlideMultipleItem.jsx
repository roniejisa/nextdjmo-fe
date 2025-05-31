"use client";
import ImageCustom from "@/components/Maintain/Image";
import LinkCustom from "@/packages/translation/Link";
import { formatTime, showImageUrl } from "@/utils/client";
import React from "react";

const SlideMultipleItem = ({ item, onClick }) => {
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return (
    <div className="shadow-[2px_2px_2px_1px] shadow-active-light rounded-md relative">
      <LinkCustom
        className="relative block h-[250px] bg-white rounded-tl-md rounded-tr-md"
        href={"/san-pham/" + item.slug}
        onClick={onClick}
      >
        <ImageCustom src={showImageUrl(item.image)} fill={true} />
      </LinkCustom>
      <div className="absolute min-w-[100px] top-0 right-5 bg-active text-white px-2 py-1 after:content-[''] after:absolute after:border-[10px] after:border-t-active after:top-full after:left-0 after:w-full after:border-transparent after:border-t-white">
        <span className="text-2xl block text-center font-bold text-white">
          {day}
        </span>
        <p className="text-center">
          T{month}, {year}
        </p>
      </div>
      <div className="p-4">
        <h3 className="font-medium transition duration-300 text-2xl text-active hover:text-active-light">
          <LinkCustom href={"/tin-tuc/" + item.slug}>{item.name}</LinkCustom>
        </h3>
        <p className="my-2">{item.short_content}</p>

        {/* <div className="flex items-center gap-4">
          <p className="text-active font-bold">
            {Intl.NumberFormat().format(item.price_sale)} đ
          </p>
          <del className="text-xs ">
            {Intl.NumberFormat().format(item.price)} đ
          </del>
        </div> */}
      </div>
    </div>
  );
};

export default SlideMultipleItem;
