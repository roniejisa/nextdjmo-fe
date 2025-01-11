"use client";

import QuestionModal from "@/components/Modal/QuestionModal";
import { createContext, useEffect, useState } from "react";

export const AllContext = createContext();
const AllProvider = ({ children }) => {
  const [showModalQuestion, setShowModalQuestion] = useState(false);
  const [modalOptions, setModalOptions] = useState({});
  useEffect(() => {
    if (!showModalQuestion) setModalOptions({});
  }, [showModalQuestion]);
  return (
    <AllContext.Provider
      value={{
        showModalQuestion,
        setShowModalQuestion,
        modalOptions,
        setModalOptions
      }}
    >
      {children}
      <QuestionModal />
    </AllContext.Provider>
  );
};

export default AllProvider;
