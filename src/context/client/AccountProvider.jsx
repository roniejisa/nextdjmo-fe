"use client";
import { createContext, useEffect, useState } from "react";

export const AccountContext = createContext(null);
const AccountProvider = ({ children }) => {
  const [showOneTab, setShowOneTab] = useState(() => {
    // Khởi tạo đúng giá trị từ đầu
    return typeof document !== "undefined" ? !document.cookie.includes("logged=OK") : false;
  });

  // Không cần useEffect nữa
  return (
    <AccountContext.Provider value={{ showOneTab, setShowOneTab }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider