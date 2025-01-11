import { httpClient } from "@/utils/http";
import React from "react";
import ProductProvider from "@/context/client/ProductProvider";
import ProductClient from "./component/ProductClient";
import { redirect } from "next/navigation";

const getProduct = async (slug) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `/product/${slug}`
  );
  if (response && response.status == 200) return response.data;
  return {};
};
const Product = async ({ params }) => {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (Object.keys(product).length === 0) return redirect("/404");
  return (
    <ProductProvider product={product}>
      <ProductClient />
    </ProductProvider>
  );
};

export default Product;
