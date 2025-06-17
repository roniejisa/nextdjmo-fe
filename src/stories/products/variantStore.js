import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { useProductStore } from "./productStore";

export const useVariantStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // State
        selectedAttributes: {},

        // Actions
        setSelectedAttributes: (selectedAttributes) =>
          set({ selectedAttributes }, false, "setSelectedAttributes"),

        updateAttribute: (name, value) => {
          set(
            (state) => {
              const prev = state.selectedAttributes;
              // Toggle selection: nếu đã chọn thì bỏ chọn, chưa chọn thì chọn
              if (prev[name] === value) {
                const newSelected = { ...prev };
                delete newSelected[name];
                return { selectedAttributes: newSelected };
              }
              return { selectedAttributes: { ...prev, [name]: value } };
            },
            false,
            "updateAttribute"
          );

          // Auto update productCurrent when attributes change
          get().updateProductCurrent();
        },

        // Auto-update productCurrent when variants or attributes change
        updateProductCurrent: () => {
          const { product, setProductCurrent } = useProductStore.getState();
          const { getAvailableVariants, getDisplayPrice } = get();

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
          console.log(updatedProduct);
          setProductCurrent(updatedProduct);
        },

        resetAttribute: (name) => {
          set(
            (state) => {
              const newSelected = { ...state.selectedAttributes };
              delete newSelected[name];
              return { selectedAttributes: newSelected };
            },
            false,
            "resetAttribute"
          );

          // Auto update when reset
          get().updateProductCurrent();
        },
        getAvailableVariants: () => {
          const { selectedAttributes } = get();
          const product = useProductStore.getState().product;

          if (!product?.variants || !Array.isArray(product.variants)) return [];

          const selectedEntries = Object.entries(selectedAttributes).filter(
            ([, value]) => value !== ""
          );

          if (selectedEntries.length === 0) {
            return product.variants.filter(
              (variant) =>
                variant &&
                variant.stock !== undefined &&
                Number(variant.stock) > 0 &&
                Array.isArray(variant.attributes)
            );
          }

          return product.variants.filter((variant) => {
            if (
              !variant ||
              !Array.isArray(variant.attributes) ||
              Number(variant.stock) <= 0
            ) {
              return false;
            }

            const matchesSelected = selectedEntries.every(([name, value]) =>
              variant.attributes.some(
                (attr) => attr && attr.name === name && attr.value === value
              )
            );

            return matchesSelected;
          });
        },

        getDisplayPrice: () => {
          const availableVariants = get().getAvailableVariants();

          if (!availableVariants.length) return "0 VND";

          if (availableVariants.length === 1) {
            return `${Intl.NumberFormat().format(
              availableVariants[0].price
            )} VND`;
          }

          const prices = availableVariants.map((v) => Number(v.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);

          if (minPrice === maxPrice) {
            return `${Intl.NumberFormat().format(minPrice)} VND`;
          }

          return `${Intl.NumberFormat().format(
            minPrice
          )} VND - ${Intl.NumberFormat().format(maxPrice)} VND`;
        },

        isAttributeDisabled: (attributeName, attributeValue) => {
          const { selectedAttributes } = get();
          const product = useProductStore.getState().product;

          if (!product?.variants || !Array.isArray(product.variants))
            return true;

          const hasAvailableVariant = product.variants.some((variant) => {
            if (
              !variant ||
              !Array.isArray(variant.attributes) ||
              Number(variant.stock) <= 0
            ) {
              return false;
            }

            return variant.attributes.some(
              (attr) =>
                attr &&
                attr.name === attributeName &&
                attr.value === attributeValue
            );
          });

          if (!hasAvailableVariant) return true;

          const otherSelections = Object.entries(selectedAttributes).filter(
            ([name, value]) => name !== attributeName && value !== ""
          );

          if (otherSelections.length === 0) return false;

          return !product.variants.some((variant) => {
            if (
              !variant ||
              !Array.isArray(variant.attributes) ||
              Number(variant.stock) <= 0
            ) {
              return false;
            }

            const matchesOthers = otherSelections.every(([name, value]) =>
              variant.attributes.some(
                (attr) => attr && attr.name === name && attr.value === value
              )
            );
            const matchesCurrent = variant.attributes.some(
              (attr) =>
                attr &&
                attr.name === attributeName &&
                attr.value === attributeValue
            );
            return matchesOthers && matchesCurrent;
          });
        },

        // Tự động listen changes và trigger side effects
        setupSubscriptions: () => {
          useVariantStore.subscribe(
            (state) => state.selectedAttributes, // Watch này
            () => {
              // Khi thay đổi thì chạy những này
              get().updateProductCurrent();
              // get().updateMainImage();
              // get().dispatchCustomEvent();
            }
          );
        },
        // Initialize và setup subscriptions
        initialize: (product) => {
          console.log("ĐÃ CHẠY VÀO ĐÂY RỒI");
          get().initializeAttributes(product);
          get().validateAndCleanAttributes(product);
          get().updateProductCurrent();
          // get().setupSubscriptions();
        },
        initializeAttributes: (product) => {
          if (
            !product?.detail_variants ||
            !Array.isArray(product.detail_variants)
          )
            return;

          const initialSelected = product.detail_variants.reduce(
            (acc, variant) => {
              if (variant && variant.name) {
                acc[variant.name] = "";
              }
              return acc;
            },
            {}
          );

          set(
            { selectedAttributes: initialSelected },
            false,
            "initializeAttributes"
          );
        },

        // Reset invalid selections
        validateAndCleanAttributes: (product) => {
          const { selectedAttributes, isAttributeDisabled } = get();

          if (
            !product?.detail_variants ||
            !Array.isArray(product.detail_variants)
          )
            return;

          set(
            (state) => {
              const newSelected = { ...state.selectedAttributes };
              let hasChanges = false;

              Object.entries(state.selectedAttributes).forEach(
                ([name, value]) => {
                  if (value && value !== "") {
                    const attributeExists = product.detail_variants.some(
                      (attr) => attr && attr.name === name
                    );

                    if (!attributeExists) {
                      newSelected[name] = "";
                      hasChanges = true;
                    } else {
                      const valueExists = product.detail_variants
                        .find((attr) => attr && attr.name === name)
                        ?.values?.some((v) => v && v.value === value);

                      if (!valueExists || isAttributeDisabled(name, value)) {
                        newSelected[name] = "";
                        hasChanges = true;
                      }
                    }
                  }
                }
              );

              product.detail_variants.forEach((attr) => {
                if (attr && attr.name && !(attr.name in newSelected)) {
                  newSelected[attr.name] = "";
                  hasChanges = true;
                }
              });

              return hasChanges ? { selectedAttributes: newSelected } : state;
            },
            false,
            "validateAndCleanAttributes"
          );
        },

        // Reset store
        reset: () =>
          set(
            {
              selectedAttributes: {},
            },
            false,
            "reset"
          ),
      }),
      {
        name: "variant-store",
      }
    )
  )
);
