"use client";
import { useState, useTransition } from "react";

// Hook quản lý state comment chung
export const useCommentState = (initialComments = [], initialTotal = 0) => {
  const [comments, setComments] = useState(initialComments);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [focusComment, setFocusComment] = useState(null);
  const [isPending, startTransition] = useTransition();

  const toggleReplication = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, showReplication: !comment.showReplication }
          : comment
      )
    );

    const targetComment = comments.find((comment) => comment.id === commentId);
    if (targetComment) {
      setFocusComment(!targetComment.showReplication ? commentId : null);
    }
  };

  const showChild = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, showChild: true } : comment
      )
    );
  };

  const addNewComments = (newComments, newTotal) => {
    setTotal(newTotal);
    setComments((prev) => {
      const filteredComments = newComments.filter(
        (item) => !prev.some((comment) => comment.id === item.id)
      );
      return [...prev, ...filteredComments];
    });
  };

  return {
    comments,
    setComments,
    total,
    page,
    setPage,
    focusComment,
    isPending,
    startTransition,
    toggleReplication,
    showChild,
    addNewComments,
  };
};
