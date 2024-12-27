import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import React from "react";
import Variant from "./component/Variant";
import ProductProvider from "@/context/ProductProvider";
import ProductClient from "./component/ProductClient";

const getProduct = async (slug) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `/product/${slug}`
  );
  if (response.status == 200) return response.data;
  return {};
};
const Product = async ({ params }) => {
  const { slug } = await params;
  const product = await getProduct(slug);
  return (
    <ProductProvider product={product}>
      <p>Tên sản phẩm: {product.name}</p>
      <ProductClient />
    </ProductProvider>
  );
};

export default Product;
