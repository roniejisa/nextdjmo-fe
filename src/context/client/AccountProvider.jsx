"use client";
import { createContext, useEffect, useState } from "react";

export const AccountContext = createContext(null);
const AccountProvider = ({ children }) => {
  const [showOneTab, setShowOneTab] = useState(false);
  useEffect(() => {
    if (document.cookie.includes("logged=OK")){
      setShowOneTab(false);
    }else{
      setShowOneTab(true);
    }
  }, []);

  return (
    <AccountContext.Provider value={{ showOneTab, setShowOneTab }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
