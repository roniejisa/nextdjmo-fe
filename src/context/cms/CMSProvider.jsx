// context/cms/CMSProvider.js - Cải thiện để tránh profile reset

"use client";

import QuickCreate from "@/app/(cms)/(has-sidebar)/system/[module]/(page)/create/components/QuickCreate";
import QuestionModal from "@/components/Modal/QuestionModal";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "../SocketProvider";
import ImageProvider from "./ImageProvider";

export const CMSContext = createContext();

const CMSProvider = ({ children, profile: initialProfile }) => {
  const [showModalQuestion, setShowModalQuestion] = useState(false);
  const [modalOptions, setModalOptions] = useState({});
  const [modalQuick, setModalQuick] = useState(false);
  const [updateField, setUpdateField] = useState(null);
  
  // QUAN TRỌNG: Dùng ref để giữ profile stable, tránh re-render reset
  const profileRef = useRef(initialProfile);
  const [profile, setProfile] = useState(initialProfile);
  
  const {
    socketRef,
    typeRef,
    addTypes,
    sessionIdRef,
    setSessionId,
    connectSocket,
  } = useContext(SocketContext);

  // Chỉ update profile khi có dữ liệu hợp lệ
  useEffect(() => {
    if (initialProfile && initialProfile.user && initialProfile.user._id) {
      // Chỉ update nếu profile thực sự thay đổi
      if (!profileRef.current || 
          !profileRef.current.user || 
          profileRef.current.user._id !== initialProfile.user._id) {
        
        console.log("Updating profile:", initialProfile.user._id);
        profileRef.current = initialProfile;
        setProfile(initialProfile);
      }
    } else if (initialProfile && Object.keys(initialProfile).length === 0) {
      // Nếu nhận được profile rỗng, GIỮ NGUYÊN profile cũ
      console.warn("Received empty profile, keeping existing profile");
      // Không update profile để tránh reset
    }
  }, [initialProfile]);

  useEffect(() => {
    if (!showModalQuestion) setModalOptions({});
  }, [showModalQuestion]);

  useEffect(() => {
    // Chỉ connect socket khi có profile hợp lệ
    if (profile && profile.user && profile.user._id) {
      console.log("Connecting socket for user:", profile.user._id);
      setSessionId(profile.user._id);
      connectSocket();
    }
  }, [profile, setSessionId, connectSocket]);

  // Fallback: nếu profile bị reset, dùng profileRef
  const activeProfile = profile && profile.user ? profile : profileRef.current;

  return (
    <CMSContext.Provider
      value={{
        profile: activeProfile, // Dùng activeProfile thay vì profile trực tiếp
        socketRef,
        typeRef,
        addTypes,
        sessionIdRef,
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
      <ImageProvider>
        {children}
        <QuestionModal />
        <QuickCreate />
      </ImageProvider>
    </CMSContext.Provider>
  );
};

export default CMSProvider;