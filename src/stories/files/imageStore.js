import { create } from "zustand";

export const useImageStore = create((set, get) => ({
  // State
  showMedia: false,
  dataImage: null,
  isMultiple: false,
  choosed: null,
  listImageChoosed: [],
  listFileSelected: [],
  fileCurrent: [],

  // Actions
  setShowMedia: (value) => set({ showMedia: value }),
  setDataImage: (value) => set({ dataImage: value }),
  setIsMultiple: (value) => set({ isMultiple: value }),
  setChoosed: (value) => set({ choosed: value }),
  setListImageChoosed: (value) => set({ listImageChoosed: value }),
  setListFileSelected: (value) => set({ listFileSelected: value }),
  
  // Cải thiện setFileCurrent
  setFileCurrent: (value) => {
    if (typeof value === "function") {
      set((state) => {
        const currentFileCurrent = state.fileCurrent || [];
        const newFileCurrent = value(currentFileCurrent);
        
        // Đảm bảo trả về array mới
        return {
          fileCurrent: Array.isArray(newFileCurrent) ? [...newFileCurrent] : []
        };
      });
    } else {
      set({ 
        fileCurrent: Array.isArray(value) ? [...value] : [] 
      });
    }
  },

  // Cải thiện updateFileCurrent
  updateFileCurrent: (id, data) => {
    set((state) => {
      const fileCurrent = state.fileCurrent || [];
      const index = fileCurrent.findIndex((item) => item.id === id);
      
      let newFileCurrent;
      if (index !== -1) {
        newFileCurrent = fileCurrent.map((item, idx) => 
          idx === index ? { ...item, data } : item
        );
      } else {
        newFileCurrent = [...fileCurrent, { id, data }];
      }

      return { fileCurrent: newFileCurrent };
    });
  },

  // Cải thiện updateFileCurrentItems
  updateFileCurrentItems: (id, items) => {
    set((state) => {
      const fileCurrent = state.fileCurrent || [];
      const index = fileCurrent.findIndex((item) => item.id === id);
      
      let newFileCurrent;
      if (index !== -1) {
        const existingItems = fileCurrent[index].items || [];
        const newItems = items.filter(
          (newItem) =>
            !existingItems.some(
              (existingItem) => existingItem._id === newItem._id
            )
        );
        
        newFileCurrent = fileCurrent.map((item, idx) => 
          idx === index 
            ? { ...item, items: [...existingItems, ...newItems] }
            : item
        );
      } else {
        newFileCurrent = [...fileCurrent, { id, items: [...items] }];
      }

      return { fileCurrent: newFileCurrent };
    });
  },

  // Thêm action để xóa item
  removeItemFromFile: (fileId, itemId) => {
    set((state) => {
      const fileCurrent = state.fileCurrent || [];
      const newFileCurrent = fileCurrent.map((file) => {
        if (file.id === fileId) {
          const newItems = (file.items || []).filter(
            (item) => item._id !== itemId
          );
          return { ...file, items: newItems };
        }
        return file;
      });

      return { fileCurrent: newFileCurrent };
    });
  },

  resetImageStore: () =>
    set({
      showMedia: false,
      dataImage: null,
      isMultiple: false,
      choosed: null,
      listImageChoosed: [],
      listFileSelected: [],
      fileCurrent: [],
    }),
}));