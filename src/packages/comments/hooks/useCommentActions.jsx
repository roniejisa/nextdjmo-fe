"use client";

import { useContext } from "react";
import { CommentContext } from "../CommentProvider";
import { getDataComment, submitReview } from "../action";
import useRouterCustom from "@/packages/translation/Navigation";

const { useNotify } = require("@/context/NotifyProvider");
const { usePathname } = require("next/navigation");

// Custom hooks tách logic ra khỏi component
export const useCommentActions = () => {
  const { type, id } = useContext(CommentContext);
  const router = useRouterCustom();
  const notify = useNotify();
  const pathname = usePathname();

  const handleSubmitReply = async (body) => {
    body.type = type;
    body.id = id;
    const response = await submitReview(body);

    if (response.status === 401) {
      router.pushWithQuery("/dang-nhap", { redirect: pathname });
      notify.changeNotify("error", response.message);
    } else if (response.status === 200) {
      notify.changeNotify("success", response.message);
    }
  };

  const loadComments = async (params) => {
    const response = await getDataComment({
      type,
      id,
      ...params,
    });
    return response;
  };

  return { handleSubmitReply, loadComments };
};
