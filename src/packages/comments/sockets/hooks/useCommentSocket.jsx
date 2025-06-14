"use client";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/context/SocketProvider";
import { ClientContext } from "@/context/client/ClientProvider";

export const useCommentSocket = (type, id) => {
  const {
    socketRef,
    sessionIdRef,
    setSessionId,
    connectSocket,
    socketOn, // Giờ đây là state thay vì ref
  } = useContext(SocketContext);

  const { ssId } = useContext(ClientContext);

  const sendJoinModuleComment = () => {
    if (!socketRef.current || !type || !id || !sessionIdRef.current) return;

    const joinData = {
      type: "join-module-comment",
      data: {
        module: type,
        module_id: id,
        id: sessionIdRef.current,
      },
    };

    socketRef.current.sendEncode(joinData);
    console.log("🚀 Joined comment module:", type, id);
  };

  const sendLeaveModuleComment = () => {
    if (!socketRef.current || !type || !id || !sessionIdRef.current) return;

    socketRef.current.sendEncode({
      type: "leave-module-comment",
      data: {
        module: type,
        module_id: id,
        id: sessionIdRef.current,
      },
    });
    console.log("👋 Left comment module:", type, id);
  };

  // Initialize socket và session
  useEffect(() => {
    const initSocket = async () => {
      setSessionId(ssId);
      connectSocket();
    };

    initSocket();
  }, [setSessionId, connectSocket]);

  // Join room khi socket connected
  useEffect(() => {
    if (socketOn && type && id) {
      // Join room ngay khi socket connected
      sendJoinModuleComment();

      // Return cleanup function
      return () => {
        sendLeaveModuleComment();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketOn, type, id]); // Dependency vào socketOn state

  return {
    socketConnected: socketOn,
    joinRoom: sendJoinModuleComment,
    leaveRoom: sendLeaveModuleComment,
  };
};
