"use client";

import QuickCreate from "@/app/(cms)/(has-sidebar)/system/[module]/(context-image)/create/components/QuickCreate";
import QuestionModal from "@/components/Modal/QuestionModal";
import { createContext, useEffect, useState } from "react";

export const AllContext = createContext();
const AllProvider = ({ children }) => {
  const [showModalQuestion, setShowModalQuestion] = useState(false);
  const [modalOptions, setModalOptions] = useState({});
  const [modalQuick, setModalQuick] = useState(false);
  const [updateField, setUpdateField] = useState(null);

  useEffect(() => {
    if (!showModalQuestion) setModalOptions({});
  }, [showModalQuestion]);
  return (
    <AllContext.Provider
      value={{
        showModalQuestion,
        setShowModalQuestion,
        modalOptions,
        setModalOptions,
        modalQuick,
        setModalQuick,
        updateField,
        setUpdateField,
      }}
    >
      {children}
      <QuestionModal />
      <QuickCreate />
    </AllContext.Provider>
  );
};

export default AllProvider;
