"use client";

import { useContext } from "react";
import Variant from "./Variant";
import { ProductContext } from "@/context/ProductProvider";
import { showImageUrl } from "@/utils/client/util";
import Image from "next/image";

const ProductClient = () => {
  const { products, productCurrent, firstAttribute, imageVariants, imageRef } =
    useContext(ProductContext);
  if (productCurrent == null) return <div></div>;
  return (
    <div className="flex">
      <div className="lg:flex-[0_0_40%]">
        <Image
          ref={imageRef}
          src={showImageUrl(productCurrent?.image)}
          alt={productCurrent?.name}
          width={100}
          height={100}
          className="w-full"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{productCurrent?.name}</h1>
        <p className="text-lg">{productCurrent?.sku}</p>
        <p className="text-lg">Số lượng: {productCurrent?.stock}</p>
        <p className="text-lg font-bold">
          Giá: {Intl.NumberFormat().format(productCurrent?.price)} VND
        </p>
        <Variant />
      </div>
      {/* Ảnh ở đây này */}
    </div>
  );
};

export default ProductClient;
