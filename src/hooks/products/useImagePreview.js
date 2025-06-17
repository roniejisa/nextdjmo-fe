import { useCallback } from "react";
import { showImageUrl } from "@/utils/client";
import { useProductStore } from "@/stories/products/productStore";
import { useVariantStore } from "@/stories/products/variantStore";

export const useImagePreview = () => {
  const imageRef = useProductStore((state) => state.imageRef);
  const productCurrent = useProductStore((state) => state.productCurrent);
  const getFirstAttribute = useProductStore((state) => state.getFirstAttribute);
  const getImageVariants = useProductStore((state) => state.getImageVariants);
  const selectedAttributes = useVariantStore(
    (state) => state.selectedAttributes
  );

  const handleImagePreview = useCallback(
    (value, isEntering) => {
      const imageVariants = getImageVariants();
      const firstAttribute = getFirstAttribute();

      if (!imageRef?.current || !imageVariants[value]) return;

      if (isEntering) {
        imageRef.current.src = showImageUrl(imageVariants[value]);
      } else {
        const currentImage =
          productCurrent?.image ||
          (firstAttribute && selectedAttributes[firstAttribute]
            ? imageVariants[selectedAttributes[firstAttribute]]
            : Object.values(imageVariants)[0]);

        if (currentImage) {
          imageRef.current.src = showImageUrl(currentImage);
        }
      }
    },
    [
      imageRef,
      productCurrent?.image,
      getFirstAttribute,
      getImageVariants,
      selectedAttributes,
    ]
  );

  return { handleImagePreview };
};
