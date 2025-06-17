import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUIStore = create(
  devtools((set, get) => ({
    // State
    isLoading: false,
    error: null,
    notifications: [],
    
    // Actions
    setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
    
    setError: (error) => set({ error }, false, 'setError'),
    
    clearError: () => set({ error: null }, false, 'clearError'),
    
    addNotification: (notification) => set((state) => ({
      notifications: [...state.notifications, {
        id: Date.now(),
        timestamp: new Date(),
        ...notification
      }]
    }), false, 'addNotification'),
    
    removeNotification: (id) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }), false, 'removeNotification'),
    
    clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),
    
    // Reset store
    reset: () => set({
      isLoading: false,
      error: null,
      notifications: [],
    }, false, 'reset'),
  }), {
    name: 'ui-store'
  })
);
