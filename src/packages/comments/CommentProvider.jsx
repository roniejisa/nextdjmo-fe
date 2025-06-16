"use client";

import { createContext, useEffect } from "react";

export const CommentContext = createContext();

const CommentProvider = ({ children, type, id }) => {
  return (
    <CommentContext.Provider value={{ type, id }}>
      {children}
    </CommentContext.Provider>
  );
};

export default CommentProvider;
