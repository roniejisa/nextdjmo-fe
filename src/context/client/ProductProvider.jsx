"use client";
import { useProductInitialization } from "@/hooks/products/useProductInitialization";
import { useProductStore } from "@/stories/products/productStore";
import { createContext } from "react";

export const ProductContext = createContext(null);
const ProductProvider = ({ children, product }) => {
  const setProduct = useProductStore((state) => state.setProduct);
  setProduct(product);
  useProductInitialization();

  return (
    <ProductContext.Provider
      value={{
        product,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
