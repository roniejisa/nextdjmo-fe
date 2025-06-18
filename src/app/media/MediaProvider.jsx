"use client";
import { createContext, useRef } from "react";
export const MediaContext = createContext({});
const MediaProvider = ({ children }) => {
  const menuRef = useRef([])
  return (
    <MediaContext.Provider
      value={{
        menuRef,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

export default MediaProvider;
