"use client";

import QuickCreate from "@/app/(cms)/(has-sidebar)/system/[module]/(context-image)/create/components/QuickCreate";
import QuestionModal from "@/components/Modal/QuestionModal";
import { createContext, useContext, useEffect, useState } from "react";
import { SocketContext } from "../SocketProvider";

export const AllContext = createContext();
const AllProvider = ({ children, profile }) => {
  const [showModalQuestion, setShowModalQuestion] = useState(false);
  const [modalOptions, setModalOptions] = useState({});
  const [modalQuick, setModalQuick] = useState(false);
  const [updateField, setUpdateField] = useState(null);
  const {
    socketRef,
    typeRef,
    addTypes,
    sessionIdRef,
    setSessionId,
    connectSocket,
  } = useContext(SocketContext);

  useEffect(() => {
    if (!showModalQuestion) setModalOptions({});
  }, [showModalQuestion]);

  useEffect(() => {
    console.log(profile)
    if (profile) {
      setSessionId(profile.user._id);
      connectSocket();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
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
