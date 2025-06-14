"use client";
import { useCallback, useContext, useEffect, useRef } from "react";
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
  const debounceTimeoutRef = useRef(new Map());

  // Sử dụng comment socket
  const { socketConnected } = useCommentSocket(type, id);

  // Debounced event handlers to prevent rapid-fire updates
  const createDebouncedHandler = useCallback((key, handler, delay = 150) => {
    return (data) => {
      const existingTimeout = debounceTimeoutRef.current.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeoutId = setTimeout(() => {
        handler(data);
        debounceTimeoutRef.current.delete(key);
      }, delay);

      debounceTimeoutRef.current.set(key, timeoutId);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNewComment = useCallback(
    createDebouncedHandler(
      "new_comment",
      (data) => {
        console.log("🔥 New comment received:", data);
        onNewComment?.(data.comment);
      },
      100
    ), // Fast response for new comments
    [onNewComment, createDebouncedHandler]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateComment = useCallback(
    createDebouncedHandler(
      "update_comment",
      (data) => {
        console.log("✏️ Update comment received:", data);
        onUpdateComment?.(data.comment);
      },
      100
    ), // Slightly slower for updates
    [onUpdateComment, createDebouncedHandler]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDeleteComment = useCallback(
    createDebouncedHandler(
      "delete_comment",
      (data) => {
        console.log("🗑️ Delete comment received:", data);
        onDeleteComment?.(data.commentId);
      },
      100
    ), // Fast response for deletes
    [onDeleteComment, createDebouncedHandler]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateReaction = useCallback(
    createDebouncedHandler(
      "update_reaction",
      (data) => {
        onUpdateReaction?.(data);
      },
      100
    ), // Fast response for deletes
    [onUpdateReaction, createDebouncedHandler]
  );

  // Memoized event handler to prevent recreation
  const eventHandler = useCallback(
    (data) => {
      if (!data?.action) {
        console.log("❓ Invalid socket data:", data);
        return;
      }

      switch (data.action) {
        case "new_comment":
          handleNewComment(data);
          break;
        case "update_comment":
          handleUpdateComment(data);
          break;
        case "delete_comment":
          handleDeleteComment(data);
          break;
        case "update_reaction":
          handleUpdateReaction(data);
        default:
          console.log("❓ Unknown socket action:", data.action);
      }
    },
    [
      handleNewComment,
      handleUpdateComment,
      handleDeleteComment,
      handleUpdateReaction,
    ]
  );

  // Register socket event handlers with proper cleanup
  useEffect(() => {
    if (!socketOn || !type || !id) return;

    const eventKey = `join-module-comment-${type}-${id}`;
    console.log("🎪 Registering event handler for:", eventKey);

    // Store handler reference for cleanup
    eventHandlersRef.current.set(eventKey, eventHandler);

    // Add event handler
    addTypes(eventKey, eventHandler);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up event handler for:", eventKey);

      // Clear any pending debounce timeouts
      debounceTimeoutRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      debounceTimeoutRef.current.clear();

      // Remove event handler
      removeTypes(eventKey);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      eventHandlersRef.current.delete(eventKey);
    };
  }, [socketOn, type, id, eventHandler, addTypes, removeTypes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all debounce timeouts
      debounceTimeoutRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      debounceTimeoutRef.current.clear();

      // Clean up all event handlers
      eventHandlersRef.current.forEach((handler, key) => {
        removeTypes(key);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      eventHandlersRef.current.clear();
    };
  }, [removeTypes]);

  return {
    socketConnected,
  };
};
