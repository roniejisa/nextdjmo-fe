"use client";
import { SWRConfig } from "swr";
import { useNotify } from "./NotifyProvider";
import { useCallback } from "react";

const SWRProvider = ({ children }) => {
  const notify = useNotify();
  
  // Memoize handlers để tránh re-render không cần thiết
  const handleError = useCallback((error) => {
    console.error("SWR Error:", error);

    // Kiểm tra error một cách an toàn
    const errorMessage = error?.message || error?.toString() || "";
    
    if (errorMessage.includes("Unauthorized")) {
      // Sử dụng setTimeout để tránh state update trong render
      setTimeout(() => {
        window.location.href = "/login";
      }, 0);
    } else if (errorMessage.includes("Network error")) {
      notify.changeNotify(
        "error",
        "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet."
      );
    } else {
      notify.changeNotify("error", errorMessage || "Có lỗi xảy ra");
    }
  }, [notify]);

  const handleSuccess = useCallback((data, key) => {
    // Kiểm tra data một cách an toàn
    if (data && typeof data === 'object' && data.status >= 400) {
      const error = new Error(data.message || "Request failed");
      // Throw error trong callback có thể gây vấn đề
      // Thay vào đó, log hoặc handle khác
      console.error("Response error:", error);
      handleError(error);
      return;
    }
  }, [handleError]);

  // Memoize config object
  const swrConfig = {
    // Global SWR configuration
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000,

    // Global error handler
    onError: handleError,

    // Global success handler - loại bỏ throw error
    onSuccess: handleSuccess,

    // Fallback data
    fallback: {},

    // Keep previous data while revalidating
    keepPreviousData: true,
  };

  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;