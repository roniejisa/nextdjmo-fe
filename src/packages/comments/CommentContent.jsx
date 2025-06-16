/* eslint-disable react/display-name */
"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  memo,
  useRef,
} from "react";
import { CommentContext } from "./CommentProvider";
import { useCommentActions } from "./hooks/useCommentActions";
import { useCommentState } from "./hooks/useCommentState";
import "./comment-reaction.scss";
import "./assets/all.scss"; // Import file SCSS mới
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
      <div key={comment._id} className="cc-comment-wrapper">
        {/* Comment chính với animation */}
        <div
          className={`cc-comment-main ${
            index === 0 ? "cc-animate-fade-in-down" : ""
          }`}
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
        <div className="cc-comment-children">
          {comment?.showReplication && (
            <div
              className={`cc-vertical-line ${
                comment.showChild
                  ? "cc-vertical-line--with-child"
                  : "cc-vertical-line--no-child"
              } ${
                comment?.childs?.total > 0
                  ? "cc-vertical-line--full-height"
                  : "cc-vertical-line--short-height"
              }`}
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
        <div className="cc-reply-form-wrapper">
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
    updateReactionInTree,
  } = useCommentState();

  // Debounced socket event handlers to prevent rapid updates
  const timeoutRefs = useRef({
    newComment: null,
    updateComment: null,
    deleteComment: null,
    updateReaction: null,
  });

  const debouncedHandlers = useMemo(
    () => ({
      handleNewComment: (newComment) => {
        if (timeoutRefs.current.newComment) {
          clearTimeout(timeoutRefs.current.newComment);
        }
        timeoutRefs.current.newComment = setTimeout(() => {
          addCommentToTree(newComment);
          timeoutRefs.current.newComment = null;
        }, 100);
      },

      handleUpdateComment: (updatedComment) => {
        if (timeoutRefs.current.updateComment) {
          clearTimeout(timeoutRefs.current.updateComment);
        }
        timeoutRefs.current.updateComment = setTimeout(() => {
          updateCommentInTree(updatedComment);
          timeoutRefs.current.updateComment = null;
        }, 100);
      },

      handleDeleteComment: (commentId) => {
        if (timeoutRefs.current.deleteComment) {
          clearTimeout(timeoutRefs.current.deleteComment);
        }
        timeoutRefs.current.deleteComment = setTimeout(() => {
          deleteCommentFromTree(commentId);
          timeoutRefs.current.deleteComment = null;
        }, 100);
      },

      handleUpdateReaction: (data) => {
        if (timeoutRefs.current.deleteComment) {
          clearTimeout(timeoutRefs.current.deleteComment);
        }
        timeoutRefs.current.updateReaction = setTimeout(() => {
          updateReactionInTree(data.comment_id, data.data);
          timeoutRefs.current.updateReaction = null;
        }, 100);
      },
    }),
    [
      addCommentToTree,
      updateCommentInTree,
      deleteCommentFromTree,
      updateReactionInTree,
    ]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const loadInitialComments = async () => {
      const response = await loadComments({ page: 1 });
      if (response.status === 200) {
        addNewComments(response.data.comments, response.data.total);
      }
    };

    loadInitialComments();

    return () => {};
  }, []);

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
    <div className="cc-container">
      <ModalRating socketConnected={socketConnected} total={total} />

      {/* Danh sách comment */}
      <div className="cc-comments-list">
        {comments?.length === 0 && !isPending ? (
          <div className="cc-empty-state">
            <div className="cc-empty-state__icon">
              <svg
                className="cc-empty-state__svg"
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
            <h4 className="cc-empty-state__title">Chưa có bình luận nào</h4>
            <p className="cc-empty-state__description">
              Hãy là người đầu tiên chia sẻ trải nghiệm về sản phẩm này!
            </p>
          </div>
        ) : (
          commentList
        )}

        {/* Loading hoặc load more */}
        {isPending ? (
          <div className="cc-loading-wrapper">
            <LoadingSection />
          </div>
        ) : (
          total > comments?.length && (
            <div className="cc-load-more-wrapper">
              <button onClick={handleLoadMore} className="cc-load-more-btn">
                <span className="cc-load-more-content">
                  <svg
                    className="cc-load-more-icon"
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
    </div>
  );
};

export default CommentContent;
