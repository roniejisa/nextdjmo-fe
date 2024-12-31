"use client";

import { createContext, useEffect, useRef, useState } from "react";

export const ModuleContext = createContext();
const ModuleProvider = ({ children, module, fields, user }) => {
  const selectRef = useRef([]);
  const selectAllRef = useRef(null);
  const [selectIds, setSelectIds] = useState([])

  
  return (
    <ModuleContext.Provider
      value={{
        user,
        module,
        fields,
        selectRef,
        selectAllRef,
        selectIds,
        setSelectIds
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export default ModuleProvider;
