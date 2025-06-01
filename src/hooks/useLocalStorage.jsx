"use client";

import { useLayoutEffect, useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  // Luôn bắt đầu với defaultValue để match với server
  const [value, setValue] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Chỉ đọc localStorage sau khi component đã mount (client-side)
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      setIsHydrated(true); // Đánh dấu đã hydrated xong
    }
  }, [key]);

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue, isHydrated];
};

export default useLocalStorage;
