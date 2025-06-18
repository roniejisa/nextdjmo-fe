import { create } from 'zustand';

export const useMediaStore = create((set, get) => ({
  // State
  folders: [],
  medias: [],
  showUpload: false,
  showCreateFolder: false,
  editorImage: null,
  menuPosition: null,
  listComponent: [],
  breadcrumbs: [],
  page: 1,
  openMenuIndex: null,
  
  // Filter state
  selectedFilter: 'all',
  searchTerm: '',
  
  // Refs data (store in state instead of refs)
  loadedPages: new Set(),
  
  // Actions
  setFolders: (value) => set({ folders: value }),
  setMedias: (value) => set({ medias: value }),
  setShowUpload: (value) => set({ showUpload: value }),
  setShowCreateFolder: (value) => set({ showCreateFolder: value }),
  setEditorImage: (value) => set({ editorImage: value }),
  setMenuPosition: (value) => set({ menuPosition: value }),
  setListComponent: (value) => set({ listComponent: value }),
  setBreadcrumbs: (value) => set({ breadcrumbs: value }),
  setPage: (value) => set({ page: value }),
  setOpenMenuIndex: (value) => set({ openMenuIndex: value }),
  
  // Filter actions
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  addMedias:(media) => set((state) => ({
    medias: [media, ...state.medias]
  })),

  addToBreadcrumbs: (folder) => set((state) => ({
    breadcrumbs: [...(Array.isArray(state.breadcrumbs) ? state.breadcrumbs : []), folder]
  })),
  
  updateBreadcrumbsByIndex: (index) => set((state) => ({
    breadcrumbs: index === -1 ? [] : state.breadcrumbs.slice(0, index + 1)
  })),

  // Complex actions
  addToLoadedPages: (pageNumber) => {
    const { loadedPages } = get();
    const newLoadedPages = new Set(loadedPages);
    newLoadedPages.add(pageNumber);
    set({ loadedPages: newLoadedPages });
  },
  
  removeFromMedias: (id) => {
    const { medias } = get();
    set({ medias: medias.filter((media) => media._id !== id) });
  },
  
  removeFromFolders: (id) => {
    const { folders } = get();
    set({ folders: folders.filter((folder) => folder._id !== id) });
  },
  
  // Optimized media loading
  appendMedias: (newMedias) => {
    const { medias } = get();
    const allMedias = [...medias, ...newMedias];
    // Filter duplicates based on id
    const uniqueMedias = allMedias.filter(
      (media, index, self) =>
        self.findIndex((m) => m._id === media._id) === index
    );
    set({ medias: uniqueMedias });
  },
  
  incrementPage: () => {
    const { page } = get();
    set({ page: page + 1 });
  },
  
  resetDataFolder: () => set({
    loadedPages: new Set(),
    openMenuIndex: null,
    folders: [],
    medias: [],
    page: 1,
    selectedFilter: 'all',
    searchTerm: '',
  }),
  
  resetMediaStore: () => set({
    folders: [],
    medias: [],
    showUpload: false,
    showCreateFolder: false,
    editorImage: null,
    menuPosition: null,
    listComponent: [],
    breadcrumbs: [],
    page: 1,
    openMenuIndex: null,
    loadedPages: new Set(),
    selectedFilter: 'all',
    searchTerm: '',
  }),

  // Computed getter for filtered medias
  getFilteredMedias: () => {
    const { medias, selectedFilter, searchTerm } = get();
    const FILTER_CONFIG = {
      all: { extensions: [] },
      images: { extensions: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico'] },
      videos: { extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'] },
      documents: { extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'] },
      audio: { extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'] },
      archives: { extensions: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'] },
      other: { extensions: [] }
    };

    let filtered = medias;

    // Filter by file type
    if (selectedFilter !== 'all') {
      const config = FILTER_CONFIG[selectedFilter];
      if (config && config.extensions.length > 0) {
        filtered = filtered.filter(media => {
          if(!media?.extension) return
          const extension = media.extension.toLowerCase();
          return config.extensions.includes(extension);
        });
      } else if (selectedFilter === 'other') {
        // For 'other', show files that don't match any specific category
        const allKnownExtensions = Object.values(FILTER_CONFIG)
        .filter(c => c.extensions.length > 0)
        .flatMap(c => c.extensions);
        
        filtered = filtered.filter(media => {
          if(!media?.extension) return
          const extension = media.extension.toLowerCase();
          return !allKnownExtensions.includes(extension);
        });
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(media => {
        return media.filename && media.filename.toLowerCase().includes(searchLower);
      });
    }

    return filtered;
  }
}));