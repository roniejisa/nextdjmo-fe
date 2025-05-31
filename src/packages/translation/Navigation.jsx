"use client"
import { LoadingContext } from "./LoadingProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const useRouterCustom = () => {
  const router = useRouter();
  const { setTransition, currentUrl, currentPathname } =
    useContext(LoadingContext);

  // Helper function để tạo full URL
  const createFullUrl = (path) => {
    // Nếu path đã có query params, return nguyên
    if (path.includes('?')) return path;
    
    // Nếu chỉ có pathname, return pathname
    return path;
  };

  const push = async (path) => {
    const fullPath = createFullUrl(path);
    
    // Kiểm tra nếu URL hoàn toàn giống nhau (bao gồm cả query params)
    if (currentUrl === fullPath) return;
    
    setTransition(true);
    router.push(path);
  };

  const back = async () => {
    setTransition(true);
    router.back();
  };

  const forward = async () => {
    setTransition(true);
    router.forward();
  };

  const refresh = async (duration = 500) => {
    setTransition(true);
    router.refresh();
    // Tắt loading sau thời gian chỉ định
    setTimeout(() => {
      setTransition(false);
    }, duration);
  };

  const replace = async (path) => {
    const fullPath = createFullUrl(path);
    
    if (currentUrl === fullPath) return;
    
    setTransition(true);
    router.replace(path);
  };

  const prefetch = async (path) => {
    // Prefetch không cần loading
    router.prefetch(path);
  };

  // Helper methods để làm việc với query params
  const pushWithQuery = async (pathname, queryParams = {}) => {
    const searchParams = new URLSearchParams(queryParams);
    const fullPath = searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;
    
    await push(fullPath);
  };

  const replaceWithQuery = async (pathname, queryParams = {}) => {
    const searchParams = new URLSearchParams(queryParams);
    const fullPath = searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;
    
    await replace(fullPath);
  };

  return { 
    push, 
    back, 
    forward, 
    refresh, 
    replace, 
    prefetch,
    pushWithQuery,
    replaceWithQuery,
    currentUrl,
    currentPathname
  };
};

export default useRouterCustom;