"use client";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ children }) => {
  return (
    <ClientContext.Provider value={{}}>
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
