import { create } from "zustand";

const heightChat = 62 + 16 * 2;

export const useUIStore = create((set) => ({
  editorHeight: heightChat,
  setEditorHeight: (editorHeight) => set({ editorHeight }),
}));
