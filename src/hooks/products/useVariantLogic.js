import { useProductStore } from '@/stories/products/productStore';
import { useVariantStore } from '@/stories/products/variantStore';
import { useCallback, useMemo } from 'react';

export const useVariantLogic = () => {
  // Selectors - chỉ subscribe những gì cần thiết
  const product = useProductStore((state) => state.product);
  const getFirstAttribute = useProductStore((state) => state.getFirstAttribute);
  const getImageVariants = useProductStore((state) => state.getImageVariants);
  
  const selectedAttributes = useVariantStore((state) => state.selectedAttributes);
  const updateAttribute = useVariantStore((state) => state.updateAttribute);
  const getAvailableVariants = useVariantStore((state) => state.getAvailableVariants);
  const getDisplayPrice = useVariantStore((state) => state.getDisplayPrice);
  const isAttributeDisabled = useVariantStore((state) => state.isAttributeDisabled);
  
  // Memoized values
  const firstAttribute = useMemo(() => getFirstAttribute(), [product]);
  const imageVariants = useMemo(() => getImageVariants(), [product]);
  const availableVariants = useMemo(() => getAvailableVariants(), [selectedAttributes, product]);
  const displayPrice = useMemo(() => getDisplayPrice(), [availableVariants]);
  
  // Handlers
  const handleAttributeChange = useCallback((name, value) => {
    updateAttribute(name, value);
  }, [updateAttribute]);
  
  const getVariantClassName = useCallback((name, value) => {
    const isSelected = selectedAttributes[name] === value;
    const isDisabled = isAttributeDisabled(name, value);

    let classes = "border variant flex items-center gap-2 p-2 rounded-md cursor-pointer transition-all duration-200 select-none";

    if (isDisabled) {
      classes += " opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400";
    } else if (isSelected) {
      classes += " bg-blue-500 border-blue-500 text-white shadow-md transform scale-105";
    } else {
      classes += " bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm";
    }

    return classes;
  }, [selectedAttributes, isAttributeDisabled]);
  
  return {
    // Data
    product,
    selectedAttributes,
    firstAttribute,
    imageVariants,
    availableVariants,
    displayPrice,
    
    // Functions
    handleAttributeChange,
    getVariantClassName,
    isAttributeDisabled,
  };
};