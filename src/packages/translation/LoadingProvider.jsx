"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const LoadingContext = createContext();
const LoadingProvider = ({ children, fallback }) => {
  const [transition, setTransition] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [currentPathname, setCurrentPathname] = useState(null);
  const pathname = usePathname();
  useEffect(() => {
    setCurrentPathname((prev) => {
      if (prev !== pathname) {
        setTransition(false);
        return pathname;
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isRefresh) {
      setTimeout(() => {
        setTransition(false);
        setIsRefresh(false);
      }, 1000);
    }
  }, [isRefresh]);
  return (
    <LoadingContext.Provider
      value={{
        transition,
        setTransition,
        currentPathname,
        setCurrentPathname,
        setIsRefresh,
      }}
    >
      {children}
      {fallback}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
