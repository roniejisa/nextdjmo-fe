"use client";
import ImageCustom from "@/components/Maintain/Image";
import LinkCustom from "@/packages/translation/Link";
import { showImageUrl } from "@/utils/client/util";
import React from "react";

const SlideMultipleItem = ({ item }) => {
  return (
    <div className="shadow-lg shadow-active-light rounded-md">
      <LinkCustom
        className="relative block h-[250px]"
        href={"/san-pham/" + item.slug}
      >
        <ImageCustom src={showImageUrl(item.image)} fill={true} />
      </LinkCustom>
      <div className="p-4">
        <h3 className="font-medium transition duration-300 hover:text-active-dark">
          <LinkCustom href={"/san-pham/" + item.slug}>{item.name}</LinkCustom>
        </h3>
        <p className="my-2">{item.short_content}</p>
        <div className="flex items-center gap-4">
          <p className="text-active font-bold">
            {Intl.NumberFormat().format(item.price_sale)} đ
          </p>
          <del className="text-xs ">
            {Intl.NumberFormat().format(item.price)} đ
          </del>
        </div>
      </div>
    </div>
  );
};

export default SlideMultipleItem;
