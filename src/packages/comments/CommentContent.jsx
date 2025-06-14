/* eslint-disable react/display-name */
"use client";

import { useCallback, useContext, useEffect, useMemo, memo, useRef } from "react";
import { CommentContext } from "./CommentProvider";
import { useCommentActions } from "./hooks/useCommentActions";
import { useCommentState } from "./hooks/useCommentState";
import "./comment.scss";
import { useCommentSocketEvents } from "./sockets/hooks/useCommentSocketEvents";
import CommentItem from "./CommentItem";
import { LoadingSection } from "./LoadingSection";
import { RenderCommentChilds } from "./RenderCommentChilds";
import { ReplyForm } from "./ReplyForm";
import ModalRating from "./ModalRating";

// Memoized CommentItem to prevent unnecessary re-renders
const MemoizedCommentItem = memo(CommentItem);
const MemoizedRenderCommentChilds = memo(RenderCommentChilds);
const MemoizedReplyForm = memo(ReplyForm);

// Memoized comment renderer
const CommentRenderer = memo(
  ({
    comment,
    index,
    onToggleReplication,
    onSubmitReply,
    onShowChild,
    onLoadChildComments,
  }) => {
    return (
      <div key={comment._id} className="relative">
        {/* Comment chính với animation */}
        <div
          className={`
          transform transition-all duration-500 ease-out
          ${index === 0 ? "animate-fade-in-down" : ""}
        `}
        >
          <MemoizedCommentItem
            comment={comment}
            isRoot={true}
            onToggleReplication={onToggleReplication}
            onSubmitReply={onSubmitReply}
            showVerticalLine={
              comment?.childs?.total > 0 || comment?.showReplication
            }
          />
        </div>

        {/* Comment con và đường kẻ dọc */}
        <div className="relative">
          {comment?.showReplication && (
            <div
              className={`w-0.5 bg-gradient-to-b ${
                comment.showChild
                  ? "from-green-200 via-purple-200 to-blue-300"
                  : "from-green-200 via-blue-200 to-blue-200"
              } ${
                comment?.childs?.total > 0 ? "h-[calc(100%+30px)]" : "h-[32px]"
              } absolute -top-0.5 left-[23px]`}
            />
          )}
          {comment?.childs?.total > 0 && (
            <MemoizedRenderCommentChilds
              comment={comment}
              onShow={onShowChild}
              onToggleReplication={onToggleReplication}
              onSubmitReply={onSubmitReply}
              onLoadChildComments={onLoadChildComments}
            />
          )}
        </div>

        {/* Form trả lời comment chính */}
        <div className="relative pl-16">
          {comment?.showReplication && (
            <MemoizedReplyForm
              checkFocus={comment?.showReplication}
              comment={comment}
              onSubmit={onSubmitReply}
            />
          )}
        </div>
      </div>
    );
  }
);

CommentRenderer.displayName = "CommentRenderer";

const CommentContent = () => {
  const { setShowModel, type, id } = useContext(CommentContext);
  const { loadComments, handleSubmitReplyWithSocket } = useCommentActions();
  const {
    comments,
    total,
    getCurrentPage,
    incrementPage,
    focusComment,
    isPending,
    startTransition,
    toggleReplication,
    showChild,
    addNewComments,
    addCommentToTree,
    updateCommentInTree,
    deleteCommentFromTree,
    loadChildCommentsToTree,
    updateReactionInTree
  } = useCommentState();
  // Debounced socket event handlers to prevent rapid updates
  const timeoutRefs = useRef({
    newComment: null,
    updateComment: null,
    deleteComment: null,
    updateReaction: null
  });
  console.log(comments)
  const debouncedHandlers = useMemo(
    () => ({
      handleNewComment: (newComment) => {
        if (timeoutRefs.current.newComment) {
          clearTimeout(timeoutRefs.current.newComment);
        }
        timeoutRefs.current.newComment = setTimeout(() => {
          console.log("New comment received:", newComment);
          addCommentToTree(newComment);
          timeoutRefs.current.newComment = null;
        }, 100);
      },

      handleUpdateComment: (updatedComment) => {
        if (timeoutRefs.current.updateComment) {
          clearTimeout(timeoutRefs.current.updateComment);
        }
        timeoutRefs.current.updateComment = setTimeout(() => {
          console.log("Comment updated:", updatedComment);
          updateCommentInTree(updatedComment);
          timeoutRefs.current.updateComment = null;
        }, 100);
      },

      handleDeleteComment: (commentId) => {
        if (timeoutRefs.current.deleteComment) {
          clearTimeout(timeoutRefs.current.deleteComment);
        }
        timeoutRefs.current.deleteComment = setTimeout(() => {
          console.log("Comment deleted:", commentId);
          deleteCommentFromTree(commentId);
          timeoutRefs.current.deleteComment = null;
        }, 100);
      },
      
      handleUpdateReaction: (data) => {
        if (timeoutRefs.current.deleteComment) {
          clearTimeout(timeoutRefs.current.deleteComment);
        }
        timeoutRefs.current.updateReaction = setTimeout(() => {
          console.log("updateReaction:", data);
          updateReactionInTree(data.comment_id, data.data);
          timeoutRefs.current.deleteComment = null;
        }, 100);
      },
    }),
    [addCommentToTree, updateCommentInTree, deleteCommentFromTree, updateReactionInTree]
  );

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(timeoutRefs.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  // Socket events with debouncing
  const { socketConnected } = useCommentSocketEvents(
    type,
    id,
    debouncedHandlers.handleNewComment,
    debouncedHandlers.handleUpdateComment,
    debouncedHandlers.handleDeleteComment,
    debouncedHandlers.handleUpdateReaction
  );

  // Memoized load functions to prevent recreation
  const loadCommentsData = useCallback(
    async (page) => {
      const response = await loadComments({ page });
      if (response.status === 200) {
        addNewComments(response.data.comments, response.data.total);
      }
    },
    [loadComments, addNewComments]
  );

  const handleLoadChildComments = useCallback(
    (parentCommentId, childComments, totalChilds) => {
      loadChildCommentsToTree(parentCommentId, childComments, totalChilds);
    },
    [loadChildCommentsToTree]
  );

  // Initial load with cleanup
  useEffect(() => {
    let isMounted = true;

    const loadInitialComments = async () => {
      if (isMounted) {
        await loadCommentsData(1);
      }
    };

    loadInitialComments();

    return () => {
      isMounted = false;
    };
  }, [loadCommentsData]);

  // Memoized load more handler
  const handleLoadMore = useCallback(() => {
    const nextPage = incrementPage();
    startTransition(async () => {
      await loadCommentsData(nextPage);
    });
  }, [incrementPage, startTransition, loadCommentsData]);

  // Focus effect with cleanup
  useEffect(() => {
    if (focusComment) {
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(`${focusComment}`);
        element?.focus();
      }, 100); // Small delay to ensure DOM is ready

      return () => clearTimeout(timeoutId);
    }
  }, [focusComment]);

  // Memoized comment list to prevent unnecessary re-renders
  const commentList = useMemo(() => {
    return comments?.map((comment, index) => (
      <CommentRenderer
        key={comment._id}
        comment={comment}
        index={index}
        onToggleReplication={toggleReplication}
        onSubmitReply={handleSubmitReplyWithSocket}
        onShowChild={showChild}
        onLoadChildComments={handleLoadChildComments}
      />
    ));
  }, [
    comments,
    toggleReplication,
    handleSubmitReplyWithSocket,
    showChild,
    handleLoadChildComments,
  ]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <ModalRating socketConnected={socketConnected} total={total} />

      {/* Danh sách comment */}
      <div className="space-y-6">
        {comments?.length === 0 && !isPending ? (
          <div
            className={`
            relative bg-white/60 backdrop-blur-sm border border-white/20
            rounded-3xl p-12 text-center shadow-sm
            before:absolute before:inset-0 before:rounded-3xl
            before:bg-gradient-to-br before:from-white/10 before:to-transparent
            before:pointer-events-none
          `}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              Chưa có bình luận nào
            </h4>
            <p className="text-gray-500">
              Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!
            </p>
          </div>
        ) : (
          commentList
        )}

        {/* Loading hoặc load more */}
        {isPending ? (
          <div className="flex justify-center py-8">
            <LoadingSection />
          </div>
        ) : (
          total > comments?.length && (
            <div className="flex justify-center pt-6">
              <button
                onClick={handleLoadMore}
                className={`
                  relative px-8 py-4 rounded-2xl font-semibold
                  bg-gradient-to-r from-blue-50 to-indigo-50
                  hover:from-blue-100 hover:to-indigo-100
                  text-blue-700 border border-blue-200 hover:border-blue-300
                  transform hover:scale-105 active:scale-95
                  transition-all duration-300 ease-out
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30
                  before:absolute before:inset-0 before:rounded-2xl
                  before:bg-gradient-to-r before:from-white/20 before:to-transparent
                  before:opacity-0 before:transition-opacity before:duration-300
                  hover:before:opacity-100
                `}
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Tải thêm bình luận ({comments?.length}/{total})
                </span>
              </button>
            </div>
          )
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommentContent;
