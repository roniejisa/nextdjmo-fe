import { useEffect } from 'react';
import { showImageUrl } from '@/utils/client';
import { useProductStore } from '@/stories/products/productStore';
import { useVariantStore } from '@/stories/products/variantStore';

export const useProductEffects = () => {
  const {
    product,
    productCurrent,
    setProductCurrent,
    imageRef,
    productCurrentRef,
    getFirstAttribute,
    getImageVariants
  } = useProductStore();
  
  const {
    selectedAttributes,
    initializeAttributes,
    validateAndCleanAttributes,
    getAvailableVariants,
    getDisplayPrice
  } = useVariantStore();
  
  // Initialize selected attributes khi component mount
  useEffect(() => {
    if (product) {
      initializeAttributes(product);
    }
  }, [product, initializeAttributes]);
  
  // Reset selections nếu attribute đã chọn không còn available
  useEffect(() => {
    if (product) {
      validateAndCleanAttributes(product);
    }
  }, [product, validateAndCleanAttributes]);
  
  // Update product current khi available variants thay đổi
  useEffect(() => {
    if (!product) return;
    
    const availableVariants = getAvailableVariants();
    const displayPrice = getDisplayPrice();

    if (!availableVariants.length) {
      setProductCurrent({
        ...product,
        price: "Hết hàng",
        stock: 0,
      });
      return;
    }

    const baseProduct = availableVariants[0];
    const updatedProduct = {
      ...product,
      ...Object.entries(baseProduct)
        .filter(([, value]) => value !== null && value !== undefined)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {}),
      price: displayPrice,
    };

    setProductCurrent(updatedProduct);
  }, [product, selectedAttributes, setProductCurrent, getAvailableVariants, getDisplayPrice]);
  
  // Update DOM elements khi productCurrent thay đổi
  useEffect(() => {
    if (!productCurrentRef?.current || !productCurrent) return;
    
    const imageVariants = getImageVariants();

    const eventChangeProductCurrent = new CustomEvent(
      "change-product-current",
      {
        detail: {
          productCurrent,
          selectedAttributes,
        },
      }
    );
    window.dispatchEvent(eventChangeProductCurrent);
    
    const refs = productCurrentRef.current;
    if (refs.name) refs.name.innerText = productCurrent.name || "";
    if (refs.price) refs.price.innerText = productCurrent.price || "";
    if (refs.stock) refs.stock.innerText = productCurrent.stock || "";
    if (refs.sku) refs.sku.innerText = productCurrent.sku || "";
    productCurrentRef.current.images = imageVariants;
  }, [productCurrent, selectedAttributes, productCurrentRef, getImageVariants]);
  
  // Update main product image khi selection thay đổi
  useEffect(() => {
    if (!imageRef?.current) return;
    
    const firstAttribute = getFirstAttribute();
    const imageVariants = getImageVariants();
    
    if (!firstAttribute) return;

    let imageToShow;

    if (
      selectedAttributes[firstAttribute] &&
      imageVariants[selectedAttributes[firstAttribute]]
    ) {
      imageToShow = imageVariants[selectedAttributes[firstAttribute]];
    } else if (Object.keys(imageVariants).length > 0) {
      imageToShow = Object.values(imageVariants)[0];
    } else if (productCurrent?.image) {
      imageToShow = productCurrent.image;
    }

    if (imageToShow) {
      imageRef.current.src = showImageUrl(imageToShow);
    }
  }, [
    selectedAttributes,
    productCurrent?.image,
    imageRef,
    getFirstAttribute,
    getImageVariants
  ]);
};