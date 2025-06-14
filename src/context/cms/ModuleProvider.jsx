"use client";

import { createContext, useRef, useState } from "react";

export const ModuleContext = createContext();
const ModuleProvider = ({ children, module, fields, data }) => {
  const selectRef = useRef([]);
  const selectAllRef = useRef(null);
  const [selectIds, setSelectIds] = useState([]);

  return (
    <ModuleContext.Provider
      value={{
        data,
        module,
        fields,
        selectRef,
        selectAllRef,
        selectIds,
        setSelectIds,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export default ModuleProvider;
