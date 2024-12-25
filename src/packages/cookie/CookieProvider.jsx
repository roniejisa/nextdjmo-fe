"use client";

import { cookies } from "next/headers";
import { createContext } from "react";

const CookieContext = createContext();
const CookieProvider = ({ children }) => {
  const cookie = cookies();
  return (
    <CookieContext.Provider value={{ cookie }}>{children}</CookieContext.Provider>
  );
};

export default CookieProvider;
