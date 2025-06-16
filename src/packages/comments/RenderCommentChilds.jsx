import { LoadingSection } from "./LoadingSection";
import { useEffect, useTransition, useRef, useCallback } from "react";
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
      className={`rcc-action-btn ${
        variant === "collapse" ? "rcc-action-btn--collapse" : "rcc-action-btn--default"
      }`}
    >
      {children}
    </button>
  );

  // Sử dụng trực tiếp comment.childs.items thay vì state local
  const commentsChilds = comment?.childs?.items || [];
  const total = comment?.childs?.total || 0;

  return (
    <div className="rcc-container">
      {comment.showChild ? (
        <div className="rcc-expanded">
          {/* Main vertical line - align với avatar của parent */}
          <div className="rcc-main-vertical-line"></div>

          {/* Child comments */}
          {commentsChilds?.map((childComment, index) => {
            const isLast = index === commentsChilds.length - 1;
            const hasMore = total > commentsChilds.length;

            return (
              <div key={childComment._id} className="rcc-child-comment">
                {/* Horizontal connector line */}
                <div className="rcc-horizontal-connector"></div>
                <div className="rcc-connector-dot"></div>

                {/* Comment container */}
                <div className="rcc-comment-container">
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
                    <div className="rcc-reply-form-wrapper">
                      <div
                        className={`rcc-reply-vertical-line ${
                          childComment.showChild
                            ? "rcc-reply-vertical-line--with-child"
                            : "rcc-reply-vertical-line--no-child"
                        } ${
                          childComment?.childs?.total > 0
                            ? "rcc-reply-vertical-line--tall"
                            : "rcc-reply-vertical-line--short"
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
          <div className="rcc-actions-container">
            {/* Loading or Load more */}
            {isPending ? (
              <div className="rcc-loading-section">
                <div className="rcc-loading-connector"></div>
                <LoadingSection />
              </div>
            ) : (
              total > commentsChilds?.length && (
                <div className="rcc-load-more-section">
                  <div className="rcc-load-more-connector"></div>
                  <div className="rcc-load-more-dot"></div>
                  <ActionButton onClick={handleLoadMore}>
                    <svg
                      className="rcc-icon"
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
            <div className="rcc-collapse-section">
              <div className="rcc-collapse-connector"></div>
              <div className="rcc-collapse-dot"></div>
              <ActionButton onClick={handleShowCommentChild} variant="collapse">
                <svg
                  className="rcc-icon"
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
        <div className="rcc-collapsed">
          <div className="rcc-collapsed-vertical-line"></div>
          <div className="rcc-collapsed-connector"></div>
          <div className="rcc-collapsed-dot"></div>
          <ActionButton onClick={handleShowCommentChild}>
            <svg
              className="rcc-icon"
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