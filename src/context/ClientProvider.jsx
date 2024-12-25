"use client";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext, useEffect, useState } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);
  useEffect(() => {
  }, [showModalSearch]);
  return (
    <ClientContext.Provider value={{ showModalSearch, setShowModalSearch }}>
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
