import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export const useProductStore = create(
  subscribeWithSelector(
    devtools((set, get) => ({
      // State
      product: null,
      productCurrent: null,
      productCurrentRef: null,
      
      // Actions
      setProduct: (product) => {
        set({ product }, false, 'setProduct');
      },
      
      setProductCurrent: (productCurrent) => 
        set({ productCurrent }, false, 'setProductCurrent'),
      
      setProductCurrentRef: (productCurrentRef) => 
        set({ productCurrentRef }, false, 'setProductCurrentRef'),
    
    // Computed values
    getFirstAttribute: () => {
      const { product } = get();
      if (!product?.product_variants || Object.keys(product.detail_variants).length === 0) {
        return null;
      }
      const { listAttribute } = JSON.parse(product.product_variants);
      return listAttribute[0]?.name || null;
    },
    
    getImageVariants: () => {
      const { product } = get();
      const firstAttribute = get().getFirstAttribute();
      
      if (!firstAttribute || !product?.variants) return {};
      
      return product.variants.reduce((acc, variant) => {
        const firstAttr = variant.attributes.find(
          (attr) => attr.name === firstAttribute
        );
        if (firstAttr && variant.image && !acc[firstAttr.value]) {
          acc[firstAttr.value] = variant.image;
        }
        return acc;
      }, {});
    },
    
    // Reset store
    reset: () => set({
      product: null,
      productCurrent: null,
      imageRef: null,
      productCurrentRef: null,
    }, false, 'reset'),
  }), {
    name: 'product-store'
  })
));