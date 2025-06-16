"use client";
import { useContext, useEffect, useCallback, useRef } from "react";
import { SocketContext } from "@/context/SocketProvider";
import { ClientContext } from "@/context/client/ClientProvider";

export const useCommentSocket = (type, id) => {
  const {
    socketRef,
    sessionIdRef,
    setSessionId,
    connectSocket,
    socketOn,
  } = useContext(SocketContext);

  const { ssId } = useContext(ClientContext);
  const isJoinedRef = useRef(false);
  const reconnectTimeoutRef = useRef(null);

  const sendJoinModuleComment = useCallback(() => {
    if (!socketRef.current || !type || !id || !sessionIdRef.current || isJoinedRef.current) return;

    const joinData = {
      type: "join-module-comment",
      data: {
        module: type,
        module_id: id,
        id: sessionIdRef.current,
      },
    };

    try {
      socketRef.current.sendEncode(joinData);
      isJoinedRef.current = true;
      console.log(`🚀 Joined comment room: ${type}-${id}`);
    } catch (error) {
      console.error("❌ Failed to join room:", error);
    }
  }, [type, id, socketRef, sessionIdRef]);

  const sendLeaveModuleComment = useCallback(() => {
    if (!socketRef.current || !type || !id || !sessionIdRef.current || !isJoinedRef.current) return;

    try {
      socketRef.current.sendEncode({
        type: "leave-module-comment",
        data: {
          module: type,
          module_id: id,
          id: sessionIdRef.current,
        },
      });
      isJoinedRef.current = false;
      console.log(`👋 Left comment room: ${type}-${id}`);
    } catch (error) {
      console.error("❌ Failed to leave room:", error);
    }
  }, [type, id, socketRef, sessionIdRef]);

  // Initialize socket và session - chỉ chạy 1 lần
  useEffect(() => {
    if (ssId && !sessionIdRef.current) {
      setSessionId(ssId);
      connectSocket();
    }
  }, [ssId, setSessionId, connectSocket, sessionIdRef]);

  // Join room với retry mechanism
  useEffect(() => {
    if (!socketOn || !type || !id) return;

    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Join immediately if not already joined
    if (!isJoinedRef.current) {
      sendJoinModuleComment();
    }

    // Auto-reconnect mechanism
    const handleReconnect = () => {
      if (socketOn && !isJoinedRef.current) {
        console.log("🔄 Auto-reconnecting to comment room...");
        sendJoinModuleComment();
      }
    };

    reconnectTimeoutRef.current = setTimeout(handleReconnect, 1000);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      sendLeaveModuleComment();
    };
  }, [socketOn, type, id, sendJoinModuleComment, sendLeaveModuleComment]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      sendLeaveModuleComment();
    };
  }, [sendLeaveModuleComment]);

  return {
    socketConnected: socketOn,
    joinRoom: sendJoinModuleComment,
    leaveRoom: sendLeaveModuleComment,
    isJoined: isJoinedRef.current,
  };
};