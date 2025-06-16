"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState, useCallback, useRef } from "react";

export const LoadingContext = createContext();

const LoadingProvider = ({ children, fallback }) => {
  const [transition, setTransition] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sử dụng useRef để lưu trữ URL hiện tại mà không gây re-render
  const currentUrlRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Tạo URL đầy đủ
  const createFullUrl = useCallback(() => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  }, [pathname, searchParams]);

  // Khởi tạo URL ban đầu chỉ một lần
  useEffect(() => {
    if (!isInitializedRef.current) {
      currentUrlRef.current = createFullUrl();
      isInitializedRef.current = true;
      return; // Thoát sớm để không gây re-render
    }

    // Chỉ xử lý khi đã khởi tạo và URL thực sự thay đổi
    const newUrl = createFullUrl();
    if (currentUrlRef.current !== newUrl) {
      // URL đã thay đổi, tắt loading
      setTransition(false);
      currentUrlRef.current = newUrl;
    }
  }, [createFullUrl]);

  // Getter cho currentUrl để các component con có thể truy cập
  const getCurrentUrl = useCallback(() => {
    return currentUrlRef.current;
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        transition,
        setTransition,
        getCurrentUrl, // Thay vì currentUrl
        currentPathname: pathname,
      }}
    >
      {children}
      {transition && fallback}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
