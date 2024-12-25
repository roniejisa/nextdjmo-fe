"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const LoadingContext = createContext();
const LoadingProvider = ({ children, fallback }) => {
  const [transition, setTransition] = useState(false);
  const [currentPathname, setCurrentPathname] = useState(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchParamString, setSearchParamString] = useState("");
  useEffect(() => {
    setCurrentPathname((prev) => {
      if (prev !== pathname) {
        setTransition(false);
        return pathname;
      }
      return prev;
    });

    setSearchParamString((prev) => {
      if (prev !== searchParams.toString()) {
        setTransition(false);
        return searchParams.toString();
      }
      return prev;
    });
  }, [pathname, searchParams]);
  return (
    <LoadingContext.Provider
      value={{
        transition,
        setTransition,
        currentPathname,
        setCurrentPathname,
        searchParamString,
        setSearchParamString,
      }}
    >
      {children}
      {fallback}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
