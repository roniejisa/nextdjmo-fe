import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  isStreaming: false,
  formValue: "",

  setMessages: (messages) => set({ messages }),
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setFormValue: (formValue) => set({ formValue }),
}));
