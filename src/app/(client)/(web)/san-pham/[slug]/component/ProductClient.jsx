"use client";

import { useContext, useEffect, useState } from "react";
import Variant from "./Variant";
import { ProductContext } from "@/context/client/ProductProvider";
import { showImageUrl } from "@/utils/client/util";
import FormAddOrder from "./FormAddOrder";
import ImageCustom from "@/components/Maintain/Image";
import ImagePreview from "./ImagePreview";
import Skeleton from "@/components/Skeleton/Skeleton";

const ProductClient = () => {
  const { productCurrent } = useContext(ProductContext);

  if (productCurrent == null)
    return (
      <div className="flex w-full lg:gap-10 lg:px-10 mt-10 overflow-hidden h-full max-h-[500px]">
        <div className="lg:flex-[0_0_40%]">
          <Skeleton height="500px" />
        </div>
        <div className="flex-1">
          <Skeleton
            style={{
              marginBottom: "8px",
            }}
            width="50%"
            height="32px"
          />
          <Skeleton
            style={{
              marginBottom: "8px",
            }}
            width="30%"
            height="16px"
          />
          <Skeleton
            style={{
              marginBottom: "8px",
            }}
            width="30%"
            height="16px"
          />
          <Skeleton
            style={{
              marginBottom: "8px",
            }}
            width="50%"
            height="24px"
          />
          <Skeleton
            style={{
              marginBottom: "8px",
            }}
            height="200px"
          />
          <Skeleton width="40%"/>
        </div>
      </div>
    );

  return (
    <div className="flex  lg:gap-10 lg:px-10 mt-10">
      <div className="lg:flex-[0_0_40%]">
        <ImagePreview />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{productCurrent?.name}</h1>
        <p className="text-lg">{productCurrent?.sku}</p>
        <p className="text-lg">Số lượng: {productCurrent?.stock}</p>
        <p className="text-lg font-bold">Giá: {productCurrent?.price}</p>
        <Variant />
        <FormAddOrder />
      </div>
    </div>
  );
};

export default ProductClient;
