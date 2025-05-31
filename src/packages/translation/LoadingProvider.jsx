"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState, useCallback } from "react";

export const LoadingContext = createContext();

const LoadingProvider = ({ children, fallback }) => {
  const [transition, setTransition] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Tạo URL đầy đủ bao gồm cả pathname và searchParams
  const fullUrl = useCallback(() => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  }, [pathname, searchParams]);

  // Theo dõi thay đổi URL (bao gồm cả pathname và searchParams)
  useEffect(() => {
    const newUrl = fullUrl();
    setCurrentUrl((prevUrl) => {
      if (prevUrl !== newUrl && prevUrl !== null) {
        // URL đã thay đổi, tắt loading
        setTransition(false);
        return newUrl;
      }
      // Lần đầu tiên hoặc URL không thay đổi
      return newUrl;
    });
  }, [fullUrl]);

  return (
    <LoadingContext.Provider
      value={{
        transition,
        setTransition,
        currentUrl,
        currentPathname: pathname,
      }}
    >
      {children}
      {transition && fallback}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;