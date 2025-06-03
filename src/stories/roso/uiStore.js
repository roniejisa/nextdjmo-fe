import { create } from "zustand";

const heightChat = 162;

export const useUIStore = create((set) => ({
  editorHeight: heightChat,
  setEditorHeight: (editorHeight) => set({ editorHeight }),
}));
