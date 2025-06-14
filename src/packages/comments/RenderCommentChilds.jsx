import { LoadingSection } from "./LoadingSection";
import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import CommentItem from "./CommentItem";
import { useCommentActions } from "./hooks/useCommentActions";
import { ReplyForm } from "./ReplyForm";

// Component hiển thị comment con với glassmorphism design
export const RenderCommentChilds = ({
  comment,
  onShow,
  onToggleReplication,
  onSubmitReply,
  onLoadChildComments, // Thêm callback để update vào state chính
}) => {
  const [isPending, startTransition] = useTransition();
  const stateRef = useRef({
    isLoading: false,
    isFirstLoad: false,
    page: 0,
  });

  const { loadComments } = useCommentActions();

  // Reset khi comment._id thay đổi
  useEffect(() => {
    stateRef.current = {
      isLoading: false,
      isFirstLoad: false,
      page: 0,
    };
  }, [comment._id]);

  // Load more comments function
  const loadMoreComments = useCallback(async () => {
    if (stateRef.current.isLoading) return;

    const currentPage = stateRef.current.page;

    try {
      stateRef.current.isLoading = true;

      const response = await loadComments({
        comment_id: comment._id,
        page: currentPage,
      });

      if (response.status === 200) {
        onLoadChildComments(
          comment._id,
          response.data.comments,
          response.data.total
        );
      }
    } catch (error) {
      console.error("Failed to load child comments:", error);
    } finally {
      stateRef.current.isLoading = false;
    }
  }, [comment._id, loadComments, onLoadChildComments]);

  // Memoize handlers
  const handleShowCommentChild = useCallback(async () => {
    if (!stateRef.current.isFirstLoad) {
      stateRef.current.page = 1;
      await loadMoreComments();
      stateRef.current.isFirstLoad = true;
    }
    onShow(comment._id);
  }, [onShow, comment._id, loadMoreComments]);

  const handleLoadMore = useCallback(() => {
    stateRef.current.page += 1;

    startTransition(async () => {
      await loadMoreComments();
    });
  }, [loadMoreComments]);

  const ActionButton = ({ onClick, children, variant = "default" }) => (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-4 py-2 text-sm font-medium mb-3 rounded-xl
        backdrop-blur-sm border transition-all duration-300 transform
        hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        ${
          variant === "collapse"
            ? `
          bg-gradient-to-r from-red-50/80 to-pink-50/80 text-red-600 border-red-200/60 
          hover:from-red-100/90 hover:to-pink-100/90 hover:border-red-300/80 hover:text-red-700
        `
            : `
          bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-600 border-blue-200/60 
          hover:from-blue-100/90 hover:to-indigo-100/90 hover:border-blue-300/80 hover:text-blue-700
        `
        }
      `}
    >
      {children}
    </button>
  );

  // Sử dụng trực tiếp comment.childs.items thay vì state local
  const commentsChilds = comment?.childs?.items || [];
  const total = comment?.childs?.total || 0;

  return (
    <div className="relative">
      {comment.showChild ? (
        <div className="relative">
          {/* Main vertical line - align với avatar của parent */}
          <div className="absolute w-0.5 bg-gradient-to-b from-green-200 via-blue-200 to-purple-300 left-[23px] top-0 h-[calc(100%-18px)]"></div>

          {/* Child comments */}
          {commentsChilds?.map((childComment, index) => {
            const isLast = index === commentsChilds.length - 1;
            const hasMore = total > commentsChilds.length;

            return (
              <div key={childComment._id} className="relative">
                {/* Horizontal connector line */}
                <div className="absolute w-8 h-0.5 bg-gradient-to-r from-blue-200/60 to-blue-300/80 left-[23px] top-6"></div>
                <div className="absolute w-2 h-2 bg-blue-300/80 rounded-full left-[28px] top-[21px] border-2 border-white shadow-sm"></div>

                {/* Comment container */}
                <div className="pl-16">
                  <CommentItem
                    comment={childComment}
                    onToggleReplication={onToggleReplication}
                    onSubmitReply={onSubmitReply}
                    showVerticalLine={
                      !isLast ||
                      hasMore ||
                      childComment?.childs?.total > 0 ||
                      childComment?.showReplication
                    }
                  />

                  {/* Nested children (recursive) */}
                  {childComment?.childs?.total > 0 && (
                    <RenderCommentChilds
                      comment={childComment}
                      onShow={onShow}
                      onToggleReplication={onToggleReplication}
                      onSubmitReply={onSubmitReply}
                      onLoadChildComments={onLoadChildComments} // Truyền tiếp callback
                    />
                  )}

                  {/* Reply form */}
                  {childComment?.showReplication && (
                    <div className="mt-3 relative pl-16 mb-3">
                      <div
                        className={`absolute w-0.5 bg-gradient-to-b ${
                          childComment.showChild
                            ? "from-purple-300 via-blue-200 to-green-100"
                            : "from-green-200 via-green-200 to-blue-100"
                        } left-[23px] ${
                          childComment?.childs?.total > 0
                            ? "h-12 -top-8"
                            : "h-6 top-[-8px]"
                        }`}
                      ></div>
                      <ReplyForm
                        checkFocus={childComment?.showReplication}
                        comment={childComment}
                        onSubmit={onSubmitReply}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Action buttons container */}
          <div className="relative pl-16 mt-3 space-y-2">
            {/* Loading or Load more */}
            {isPending ? (
              <div className="relative">
                <div className="absolute w-6 h-0.5 bg-gradient-to-r from-blue-200/60 to-blue-300/80 left-[-40px] top-1/2 -translate-y-1/2"></div>
                <LoadingSection />
              </div>
            ) : (
              total > commentsChilds?.length && (
                <div className="relative">
                  <div className="absolute w-6 h-0.5 bg-gradient-to-r from-blue-200/60 to-blue-300/80 left-[-40px] top-1/2 -translate-y-1/2"></div>
                  <div className="absolute w-2 h-2 bg-blue-300/80 rounded-full left-[-37px] top-1/2 -translate-y-1/2 border-2 border-white shadow-sm"></div>
                  <ActionButton onClick={handleLoadMore}>
                    <svg
                      className="w-4 h-4"
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
                    Xem thêm {total - commentsChilds?.length} phản hồi
                  </ActionButton>
                </div>
              )
            )}

            {/* Collapse button */}
            <div className="relative">
              <div className="absolute w-6 h-0.5 bg-gradient-to-r from-blue-200/60 to-red-300/80 left-[-40px] top-1/2 -translate-y-1/2"></div>
              <div className="absolute w-2 h-2 bg-red-300/80 rounded-full left-[-37px] top-1/2 -translate-y-1/2 border-2 border-white shadow-sm"></div>
              <ActionButton onClick={handleShowCommentChild} variant="collapse">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Thu gọn
              </ActionButton>
            </div>
          </div>
        </div>
      ) : (
        // Show all replies button
        <div className="relative pl-16 mt-3">
          <div className="absolute w-0.5 bg-gradient-to-b from-green-200 via-green-100 to-blue-50 left-[23px] top-[-8px] h-[calc(100%-10px)]"></div>
          <div className="absolute w-6 h-0.5 bg-gradient-to-r from-blue-200/60 to-blue-300/80 left-[24px] top-1/2 -translate-y-1/2"></div>
          <div className="absolute w-2 h-2 bg-blue-300/80 rounded-full left-[27px] top-1/2 -translate-y-1/2 border-2 border-white shadow-sm"></div>
          <ActionButton onClick={handleShowCommentChild}>
            <svg
              className="w-4 h-4"
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
            Xem tất cả {comment.childs.total} phản hồi
          </ActionButton>
        </div>
      )}
    </div>
  );
};
