"use client";
import { ClientContext } from "@/context/client/ClientProvider";
import {
  useState,
  useTransition,
  useCallback,
  useContext,
  useRef,
  useMemo,
  useEffect,
} from "react";

export const useCommentState = (initialComments = []) => {
  const [comments, setComments] = useState(initialComments);
  const pageRef = useRef(1);
  const [total, setTotal] = useState(0);
  const [focusComment, setFocusComment] = useState(null);
  const [isPending, startTransition] = useTransition();
  const { profile } = useContext(ClientContext);
  const customer_id = profile?.user?._id;

  // Enhanced cache for better performance
  const commentMapRef = useRef(new Map());
  const updateQueueRef = useRef([]);
  const processingUpdatesRef = useRef(false);

  // Batch processing for updates
  const processBatchUpdates = useCallback(() => {
    if (processingUpdatesRef.current || updateQueueRef.current.length === 0) {
      return;
    }

    processingUpdatesRef.current = true;

    // Process all queued updates in one batch
    const updates = [...updateQueueRef.current];
    updateQueueRef.current = [];

    setComments((prev) => {
      let newComments = prev;

      updates.forEach((updateFn) => {
        newComments = updateFn(newComments);
      });

      return newComments;
    });

    processingUpdatesRef.current = false;
  }, []);

  // Queue updates for batching
  const queueUpdate = useCallback(
    (updateFn) => {
      updateQueueRef.current.push(updateFn);

      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        processBatchUpdates();
      });
    },
    [processBatchUpdates]
  );

  const buildCommentMap = useCallback((comments) => {
    const map = new Map();
    const stack = comments.map((comment) => ({ comment, parentId: null }));

    while (stack.length > 0) {
      const { comment, parentId } = stack.pop();

      map.set(comment._id, {
        ...comment,
        parentId,
        path: parentId ? `${parentId}-${comment._id}` : comment._id,
      });

      if (comment.childs?.items?.length > 0) {
        comment.childs.items.forEach((child) => {
          stack.push({ comment: child, parentId: comment._id });
        });
      }
    }

    return map;
  }, []);

  // Update comment map when comments change with debouncing
  const updateMapTimeoutRef = useRef(null);

  useMemo(() => {
    updateMapTimeoutRef.current = setTimeout(() => {
      commentMapRef.current = buildCommentMap(comments);
    }, 200);
  }, [comments, buildCommentMap]);

  useEffect(() => {
    return () => {
      if (updateMapTimeoutRef.current) {
        clearTimeout(updateMapTimeoutRef.current);
      }
    };
  }, []);

  // Optimized find with caching
  const findCommentById = useCallback((targetId) => {
    const cached = commentMapRef.current.get(targetId);
    return cached || null;
  }, []);

  // Optimized update using flat structure and reduced recursion
  const updateCommentInTree = useCallback((comments, targetId, updateFn) => {
    // Use index mapping for faster updates
    const updateIndex = comments.findIndex((c) => c._id === targetId);
    if (updateIndex !== -1) {
      const newComments = [...comments];
      newComments[updateIndex] = updateFn(newComments[updateIndex]);
      return newComments;
    }

    // Only recurse if absolutely necessary
    let hasChanges = false;
    const newComments = comments.map((comment) => {
      if (comment.childs?.items?.length > 0) {
        const updatedChilds = updateCommentInTree(
          comment.childs.items,
          targetId,
          updateFn
        );
        if (updatedChilds !== comment.childs.items) {
          hasChanges = true;
          return {
            ...comment,
            childs: {
              ...comment.childs,
              items: updatedChilds,
            },
          };
        }
      }
      return comment;
    });

    return hasChanges ? newComments : comments;
  }, []);

  // Enhanced batch updates with queueing
  const batchUpdateComments = useCallback(
    (updateFn) => {
      queueUpdate(updateFn);
    },
    [queueUpdate]
  );

  // NEW: Update reaction in tree
  const updateReactionInTree = useCallback(
    (commentId, reactionData) => {
      if (!commentId || !reactionData) return;

      const { type, customer_id } = reactionData;
      batchUpdateComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => {
          const currentReactions = comment.reactions || [];

          // Tìm reaction hiện tại của user
          const existingReactionIndex = currentReactions.findIndex(
            (reaction) => reaction.customer_id === customer_id
          );

          let newReactions = [...currentReactions];

          if (type === null || type === undefined) {
            // Nếu type là null, xóa reaction
            if (existingReactionIndex !== -1) {
              newReactions.splice(existingReactionIndex, 1);
            }
          } else {
            // Nếu type không phải null
            if (existingReactionIndex !== -1) {
              // Nếu đã có reaction, cập nhật type
              newReactions[existingReactionIndex] = {
                ...newReactions[existingReactionIndex],
                type: type,
              };
            } else {
              // Nếu chưa có reaction, thêm mới
              newReactions.push({
                type: type,
                customer_id: customer_id,
              });
            }
          }
          return {
            ...comment,
            reactions: newReactions,
          };
        })
      );
    },
    [updateCommentInTree, batchUpdateComments]
  );

  // Optimized child loading with deduplication and caching
  const loadChildCommentsToTree = useCallback(
    (parentCommentId, newChildComments, totalChilds) => {
      if (!newChildComments?.length) return;

      batchUpdateComments((prev) => {
        return updateCommentInTree(prev, parentCommentId, (comment) => {
          const existingChilds = comment.childs?.items || [];

          // Use Set for O(1) lookups
          const existingIds = new Set(existingChilds.map((c) => c._id));

          // Filter and sort new comments
          const filteredNewComments = newChildComments
            .filter((newComment) => !existingIds.has(newComment._id))
            .sort((a, b) => new Date(b.comment_at) - new Date(a.comment_at));

          if (filteredNewComments.length === 0) return comment;

          return {
            ...comment,
            childs: {
              items: [...existingChilds, ...filteredNewComments],
              total: totalChilds,
            },
          };
        });
      });
    },
    [updateCommentInTree, batchUpdateComments]
  );

  // Optimized toggle with state batching
  const toggleReplication = useCallback(
    (commentId) => {
      const currentComment = findCommentById(commentId);
      if (!currentComment) return;

      const newShowReplication = !currentComment.showReplication;

      // Batch both state updates
      batchUpdateComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => ({
          ...comment,
          showReplication: newShowReplication,
        }))
      );

      setFocusComment(newShowReplication ? commentId : null);
    },
    [findCommentById, updateCommentInTree, batchUpdateComments]
  );

  // Optimized show child with recursive optimization
  const showChild = useCallback(
    (commentId) => {
      const currentComment = findCommentById(commentId);
      if (!currentComment) return;

      const shouldShow = !currentComment.showChild;

      batchUpdateComments((prev) =>
        updateCommentInTree(prev, commentId, (comment) => {
          if (shouldShow) {
            return { ...comment, showChild: true };
          } else {
            // Optimized recursive close with single pass
            const closeAllChildren = (c) => {
              const newComment = {
                ...c,
                showChild: false,
                showReplication: false,
              };

              if (c.childs?.items?.length > 0) {
                newComment.childs = {
                  ...c.childs,
                  items: c.childs.items.map(closeAllChildren),
                };
              }

              return newComment;
            };

            return closeAllChildren(comment);
          }
        })
      );

      if (!shouldShow) {
        setFocusComment(null);
      }
    },
    [findCommentById, updateCommentInTree, batchUpdateComments]
  );

  // Optimized add new comments with sorting and deduplication
  const addNewComments = useCallback(
    (newComments, total) => {
      if (!newComments?.length) return;
      setTotal(total);
      batchUpdateComments((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const filteredComments = newComments
          .filter((item) => !existingIds.has(item._id))
          .sort((a, b) => new Date(b.comment_at) - new Date(a.comment_at));

        return filteredComments.length > 0
          ? [...prev, ...filteredComments]
          : prev;
      });
    },
    [batchUpdateComments]
  );

  // Optimized add comment with enhanced parent lookup
  // Optimized add comment with enhanced parent lookup
  const addCommentToTree = useCallback(
    (newComment) => {
      if (!newComment?._id) return;

      batchUpdateComments((prev) => {
        // Ensure newComment has reactions array initialized
        const commentWithReactions = {
          ...newComment,
          reactions: newComment.reactions || [], // Khởi tạo reactions nếu chưa có
        };

        // Root comment
        if (!commentWithReactions.comment_id) {
          // Cập nhật total khi thêm root comment
          setTotal((prevTotal) => prevTotal + 1);
          return [commentWithReactions, ...prev];
        }

        // Reply comment with enhanced parent search
        const parentComment = findCommentById(commentWithReactions.comment_id);
        if (!parentComment) {
          console.warn(
            `Parent comment ${commentWithReactions.comment_id} not found, adding as root`
          );
          // Cũng cập nhật total khi fallback về root comment
          setTotal((prevTotal) => prevTotal + 1);
          return [commentWithReactions, ...prev];
        }

        return updateCommentInTree(
          prev,
          commentWithReactions.comment_id,
          (comment) => {
            const currentChilds = comment.childs || { items: [], total: 0 };
            const isOwnerComment =
              customer_id === commentWithReactions.customer_id;

            // Sort children by date
            const sortedChilds = [
              commentWithReactions,
              ...currentChilds.items,
            ].sort((a, b) => new Date(b.comment_at) - new Date(a.comment_at));

            return {
              ...comment,
              showChild: isOwnerComment ? true : comment.showChild,
              showReplication: isOwnerComment ? false : comment.showReplication,
              childs: {
                items: sortedChilds,
                total: (currentChilds.total || 0) + 1,
              },
            };
          }
        );
      });
    },
    [findCommentById, updateCommentInTree, customer_id, batchUpdateComments]
  );

  // Simple update without transition for better performance
  const updateCommentInTree2 = useCallback(
    (updatedComment) => {
      if (!updatedComment?._id) return;

      batchUpdateComments((prev) =>
        updateCommentInTree(prev, updatedComment._id, (comment) => ({
          ...comment,
          ...updatedComment,
          // Preserve nested structure
          childs: updatedComment.childs || comment.childs,
        }))
      );
    },
    [updateCommentInTree, batchUpdateComments]
  );

  // Optimized delete with single pass and cleanup
  const deleteCommentFromTree = useCallback(
    (commentId) => {
      if (!commentId) return;

      // Kiểm tra xem comment bị xóa có phải là root comment không
      const commentToDelete = findCommentById(commentId);
      const isRootComment = commentToDelete && !commentToDelete.parentId;

      batchUpdateComments((prev) => {
        const deleteFromComments = (comments) => {
          return comments.reduce((acc, comment) => {
            if (comment._id === commentId) {
              // Don't add deleted comment to result
              return acc;
            }

            let updatedComment = comment;

            if (comment.childs?.items?.length > 0) {
              const updatedChilds = deleteFromComments(comment.childs.items);
              updatedComment = {
                ...comment,
                childs: {
                  ...comment.childs,
                  items: updatedChilds,
                  total: updatedChilds.length,
                },
              };
            }

            acc.push(updatedComment);
            return acc;
          }, []);
        };

        return deleteFromComments(prev);
      });

      // Giảm total nếu xóa root comment
      if (isRootComment) {
        setTotal((prevTotal) => Math.max(0, prevTotal - 1));
      }

      // Clear focus if focused comment is deleted
      if (focusComment === commentId) {
        setFocusComment(null);
      }
    },
    [batchUpdateComments, focusComment, findCommentById]
  );

  // Page management with validation
  const incrementPage = useCallback(() => {
    pageRef.current = Math.max(1, pageRef.current + 1);
    return pageRef.current;
  }, []);

  const getCurrentPage = useCallback(() => {
    return pageRef.current;
  }, []);

  const resetPage = useCallback(() => {
    pageRef.current = 1;
  }, []);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    updateQueueRef.current = [];
    processingUpdatesRef.current = false;
    commentMapRef.current.clear();

    if (updateMapTimeoutRef.current) {
      clearTimeout(updateMapTimeoutRef.current);
    }
  }, []);

  return {
    comments,
    setComments,
    total,
    getCurrentPage,
    incrementPage,
    resetPage,
    focusComment,
    isPending,
    startTransition,
    toggleReplication,
    showChild,
    addNewComments,
    addCommentToTree,
    updateCommentInTree: updateCommentInTree2,
    deleteCommentFromTree,
    findCommentById,
    loadChildCommentsToTree,
    updateReactionInTree, // NEW: Added reaction update function
  };
};
