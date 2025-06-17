import { useProductStore } from '@/stories/products/productStore';
import { useVariantStore } from '@/stories/products/variantStore';
import { useEffect } from 'react';

export const useProductInitialization = () => {
  const product = useProductStore((state) => state.product);
  const initialize = useVariantStore((state) => state.initialize);
  // Chỉ cần effect này duy nhất
  useEffect(() => {
    if (product) {
      initialize(product);
    }
  }, [product, initialize]);
};