"use client";
import ModalSeach from "@/components/ui/client/ModalSeach";
import { createContext, useEffect, useRef, useState } from "react";

export const ClientContext = createContext();
const ClientProvider = ({ children }) => {
  const [showModalSearch, setShowModalSearch] = useState(false);

  // HEADER
  const headerRef = useRef();
  const sectionRef = useRef({
    home: [],
  });

  return (
    <ClientContext.Provider
      value={{
        showModalSearch,
        setShowModalSearch,
        headerRef,
        sectionRef,
      }}
    >
      {children}
      <ModalSeach />
    </ClientContext.Provider>
  );
};

export default ClientProvider;
