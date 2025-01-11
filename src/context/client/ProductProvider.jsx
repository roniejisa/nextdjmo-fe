"use client";
import { createContext, useEffect, useRef, useState } from "react";

export const ProductContext = createContext(null);
const ProductProvider = ({ children, product }) => {
  const [firstAttribute, setFirstAttribute] = useState(null);
  const [productCurrent, setProductCurrent] = useState(null);
  const [imageVariants, setImageVariants] = useState({});
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const imageRef = useRef(null);

  useEffect(() => {
    if (Object.keys(product.detail_variants).length > 0) {
      const firstAttribute = Object.keys(product.detail_variants)[0];
      setFirstAttribute(firstAttribute);
      setImageVariants(() => {
        const data = product.variants.reduce((acc, variant) => {
          const attr = variant.attributes.find(
            (attr) => attr.name === firstAttribute
          ).value;
          if (!acc[attr] && variant.image) {
            acc[attr] = variant.image;
          }
          return acc;
        }, {});
        return data;
      });
    }
    setProductCurrent({
      ...product,
      ...Object.entries(product.variants[0])
        .filter(([key, value]) => value !== null && value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {}),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ProductContext.Provider
      value={{
        firstAttribute,
        setFirstAttribute,
        productCurrent,
        product,
        setProductCurrent,
        imageVariants,
        selectedAttributes,
        setSelectedAttributes,
        imageRef,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;

/**
 * Cần xác được thuộc tính nào là thuộc tính đầu tiên
 * Tổng hợp lại các ảnh của từng thuộc tính
 *
 */
