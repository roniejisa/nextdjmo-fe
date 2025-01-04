"use client";
import { useState, useEffect, useRef } from "react";

// Tạo một hook debounced
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout để trì hoãn thay đổi giá trị
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up khi component unmount hoặc value hoặc delay thay đổi
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chạy effect khi value hoặc delay thay đổi

  return debouncedValue;
}

export function debounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
