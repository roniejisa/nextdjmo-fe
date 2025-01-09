"use client"
import { createContext, useState } from "react";

export const LoginContext = createContext();
const LoginProvider = ({ children }) => {
  const [showModalOTP, setShowModalOTP] = useState(false);
  return (
    <LoginContext.Provider value={{ showModalOTP, setShowModalOTP }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
