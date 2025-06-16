"use client";
import { useCallback, useContext, useEffect, useRef, useMemo } from "react";
import { useCommentSocket } from "./useCommentSocket";
import { SocketContext } from "@/context/SocketProvider";

export const useCommentSocketEvents = (
  type,
  id,
  onNewComment,
  onUpdateComment,
  onDeleteComment,
  onUpdateReaction
) => {
  const { addTypes, removeTypes, socketOn } = useContext(SocketContext);
  const eventHandlersRef = useRef(new Map());
  
  // Loại bỏ debounce cho realtime tốt hơn
  const immediateHandlersRef = useRef(new Map());

  const { socketConnected } = useCommentSocket(type, id);

  // Tạo handlers không debounce cho tốc độ tối đa
  const handleNewComment = useCallback((data) => {
    if (data?.comment) {
      // Sử dụng requestAnimationFrame để update UI smooth hơn
      requestAnimationFrame(() => {
        onNewComment?.(data.comment);
      });
    }
  }, [onNewComment]);

  const handleUpdateComment = useCallback((data) => {
    if (data?.comment) {
      requestAnimationFrame(() => {
        onUpdateComment?.(data.comment);
      });
    }
  }, [onUpdateComment]);

  const handleDeleteComment = useCallback((data) => {
    if (data?.commentId) {
      requestAnimationFrame(() => {
        onDeleteComment?.(data.commentId);
      });
    }
  }, [onDeleteComment]);

  const handleUpdateReaction = useCallback((data) => {
    if (data) {
      requestAnimationFrame(() => {
        onUpdateReaction?.(data);
      });
    }
  }, [onUpdateReaction]);

  // Optimized event handler với early returns
  const eventHandler = useCallback((data) => {
    if (!data?.action) return;

    // Sử dụng object lookup thay vì switch cho performance
    const handlers = {
      'new_comment': handleNewComment,
      'update_comment': handleUpdateComment,
      'delete_comment': handleDeleteComment,
      'update_reaction': handleUpdateReaction,
    };

    const handler = handlers[data.action];
    if (handler) {
      handler(data);
    } else {
      console.log("❓ Unknown socket action:", data.action);
    }
  }, [handleNewComment, handleUpdateComment, handleDeleteComment, handleUpdateReaction]);

  // Memoize event key để tránh tạo lại
  const eventKey = useMemo(() => `join-module-comment-${type}-${id}`, [type, id]);

  // Register socket events một cách tối ưu
  useEffect(() => {
    if (!socketOn || !type || !id || !eventKey) return;

    // Kiểm tra xem handler đã được đăng ký chưa
    if (eventHandlersRef.current.has(eventKey)) {
      return;
    }

    // Store handler reference
    eventHandlersRef.current.set(eventKey, eventHandler);
    
    // Add event handler
    addTypes(eventKey, eventHandler);

    console.log(`📡 Registered events for: ${eventKey}`);

    return () => {
      removeTypes(eventKey);
      eventHandlersRef.current.delete(eventKey);
      console.log(`🔌 Unregistered events for: ${eventKey}`);
    };
  }, [socketOn, type, id, eventKey, eventHandler, addTypes, removeTypes]);

  // Performance monitoring (optional)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        console.log(`⏱️ Socket events active for ${endTime - startTime}ms`);
      };
    }
  }, []);

  return {
    socketConnected,
    eventKey, // Export for debugging
  };
};