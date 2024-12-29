"use client";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext, useEffect, useState } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  useEffect(() => {
  }, [showModalSearch]);

  useEffect(() => {
    console.log(totalOrders);
  }, [totalOrders]);
  return (
    <ClientContext.Provider value={{ showModalSearch, setShowModalSearch, totalOrders, setTotalOrders }}>
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
