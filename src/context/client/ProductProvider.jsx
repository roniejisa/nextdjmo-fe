"use client";
import { useProductInitialization } from "@/hooks/products/useProductInitialization";
import { useProductStore } from "@/stories/products/productStore";
import { createContext, useEffect, useRef } from "react";

export const ProductContext = createContext(null);
const ProductProvider = ({ children, product }) => {
  const imageRef = useRef();
  const setProduct = useProductStore((state) => state.setProduct);
  useProductInitialization();
  useEffect(() => {
    setProduct(product);
  }, []);
  return (
    <ProductContext.Provider
      value={{
        product,
        imageRef,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
