"use client";

import NotifyComponent from "@/components/Notify/Notify";
import { createContext, useContext, useState } from "react";

export const NotifyContext = createContext();
const NotifyProvider = ({ children, timer = 5000 }) => {
  const [showNotify, setShowNotify] = useState(false);
  const [dataNotify, setDataNotify] = useState({
    type: "",
    message: "",
  });
  const [timeout, setTimeout] = useState(timer);
  return (
    <NotifyContext.Provider
      value={{
        showNotify,
        setShowNotify,
        dataNotify,
        setDataNotify,
        timeout,
        setTimeout,
      }}
    >
      {children}
      <NotifyComponent />
    </NotifyContext.Provider>
  );
};

export default NotifyProvider;

export const useNotify = () => {
  const { setShowNotify, setDataNotify, timeout } = useContext(NotifyContext);

  const changeNotify = (type, message) => {
    setShowNotify(true);
    setDataNotify({ type, message });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  };

  return { changeNotify };
};
