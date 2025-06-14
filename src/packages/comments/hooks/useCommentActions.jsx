"use client";

import { useCallback, useContext } from "react";
import { CommentContext } from "../CommentProvider";
import { getDataComment, submitReview } from "../action";
import useRouterCustom from "@/packages/translation/Navigation";
import { SocketContext } from "@/context/SocketProvider";

const { useNotify } = require("@/context/NotifyProvider");
const { usePathname } = require("next/navigation");

// Custom hooks tách logic ra khỏi component
export const useCommentActions = () => {
  const { type, id } = useContext(CommentContext);
  const { socketRef, sessionIdRef } = useContext(SocketContext);
  const router = useRouterCustom();
  const notify = useNotify();
  const pathname = usePathname();

  const handleSubmitReply = async (body) => {
    body.type = type;
    body._id = id;

    try {
      const response = await submitReview(body);
      if (response.status === 401) {
        router.pushWithQuery("/dang-nhap", { redirect: pathname });
        notify.changeNotify("error", response.message);
        throw new Error(response.message);
      } else if (response.status === 200) {
        notify.changeNotify("success", response.message);
        return response; // Return response để ReplyForm biết submit thành công
      }
    } catch (error) {
      throw error; // Re-throw để ReplyForm handle error
    }
  };

  const handleSubmitReplyWithSocket = useCallback(
    async (body) => {
      try {
        const result = await handleSubmitReply(body);

        // Emit socket event để notify other users
        if (socketRef.current) {
          socketRef.current.sendEncode({
            type: "new-comment",
            data: {
              module: type,
              module_id: id,
              comment: result.data,
              user_id: sessionIdRef.current,
            },
          });
        }

        return result;
      } catch (error) {
        console.error("Submit reply failed:", error);
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSubmitReply, type, id]
  );

  const loadComments = async (params) => {
    const response = await getDataComment({
      type,
      _id: id,
      ...params,
    });
    return response;
  };

  return { handleSubmitReply, loadComments, handleSubmitReplyWithSocket };
};
