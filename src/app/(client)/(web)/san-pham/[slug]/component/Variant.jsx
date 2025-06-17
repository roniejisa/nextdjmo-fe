"use client";
import ImageCustom from "@/components/Maintain/Image";
import { useImagePreview } from "@/hooks/products/useImagePreview";
import { useProductEffects } from "@/hooks/products/useProductEffects";
import { useVariantLogic } from "@/hooks/products/useVariantLogic";
import { showImageUrl } from "@/utils/client";
import React from "react";

const Variant = () => {
  // Custom hooks chứa logic
  const {
    product,
    selectedAttributes,
    firstAttribute,
    imageVariants,
    availableVariants,
    handleAttributeChange,
    getVariantClassName,
    isAttributeDisabled,
  } = useVariantLogic();
  
  const { handleImagePreview } = useImagePreview();
  
  // Side effects
  useProductEffects();

  // Early return nếu không có variants
  if (!product?.detail_variants?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      {product.detail_variants.map(({ name, values: variants }, index) => {
        const availableValues = variants?.filter(
          ({ value }) => value !== "" && !isAttributeDisabled(name, value)
        );

        if (!availableValues?.length) {
          return null;
        }

        return (
          <div key={index} className="space-y-2">
            <p className="font-medium text-gray-800 text-sm uppercase tracking-wide">
              {name}
              {availableValues.length === 0 && (
                <span className="ml-2 text-xs text-red-500 font-normal">
                  (Tạm hết hàng)
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {variants
                ?.filter(({ value }) => value !== "")
                .map(({ value }, valueIndex) => {
                  const isDisabled = isAttributeDisabled(name, value);
                  const isSelected = selectedAttributes[name] === value;

                  return (
                    <label
                      key={valueIndex}
                      className={getVariantClassName(name, value)}
                      onMouseEnter={() => {
                        if (
                          name === firstAttribute &&
                          !isDisabled &&
                          imageVariants[value]
                        ) {
                          handleImagePreview(value, true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          name === firstAttribute &&
                          !isDisabled &&
                          imageVariants[value]
                        ) {
                          handleImagePreview(value, false);
                        }
                      }}
                    >
                      {name === firstAttribute && imageVariants[value] && (
                        <div className="relative">
                          <ImageCustom
                            src={showImageUrl(imageVariants[value])}
                            alt={value}
                            width={40}
                            height={40}
                            className="rounded border"
                          />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2 h-2 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}

                      <span className="font-medium">{value}</span>

                      {isDisabled && (
                        <span className="text-xs text-gray-400 ml-1">
                          (Hết hàng)
                        </span>
                      )}

                      {isSelected && name !== firstAttribute && (
                        <svg
                          className="w-4 h-4 text-current"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}

                      <input
                        type="checkbox"
                        hidden
                        name={value}
                        checked={isSelected}
                        onChange={() => handleAttributeChange(name, value)}
                        disabled={isDisabled}
                      />
                    </label>
                  );
                })}
            </div>
          </div>
        );
      })}

      {availableVariants.length === 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <svg
              className="w-4 h-4 inline mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Sản phẩm này hiện tại không có phiên bản nào còn hàng với lựa chọn hiện tại.
          </p>
        </div>
      )}
    </div>
  );
};

export default Variant;