"use client";

import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { CommentContext } from "./CommentProvider";
import StarIcon from "./StarIcon";
import Skeleton from "@/components/Skeleton/Skeleton";
import ImageCustom from "@/components/Maintain/Image";
import { formatTimeComment, showImageUrl } from "@/utils/client/util";
import Send from "@/components/Icon/svg/Send";
import { useCommentActions } from "./hooks/useCommentActions";
import { useCommentState } from "./hooks/useCommentState";
import { ReactionButton } from "./ReactionButton";
import "./comment.scss"
// Component UI chung cho comment
const CommentItem = ({
  comment,
  isRoot = false,
  onToggleReplication,
  onSubmitReply,
  showVerticalLine = false,
}) => {
  const [reactions, setReactions] = useState({});
  const handleReaction = (commentId, reactionType) => {
    setReactions((prev) => ({
      ...prev,
      [commentId]: reactionType,
    }));
  };

  return (
    <div className="flex gap-2 relative">
      {/* Avatar và đường kẻ dọc */}
      <div className="relative">
        <span className="relative w-8 h-8 block">
          <ImageCustom
            src={showImageUrl(comment?.customer?.avatar)}
            alt={comment?.customer?.last_name}
            fill={true}
            className="rounded-full"
          />
        </span>
        {showVerticalLine && (
          <div className="w-[2px] bg-gray-200 h-[calc(100%-32px)] absolute top-[32px] left-1/2 -translate-x-1/2"></div>
        )}
      </div>

      {/* Nội dung comment */}
      <div className="relative">
        <div className="bg-gray-100 p-2 rounded-xl mb-2">
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-medium">{comment?.customer?.last_name}</span>
            {isRoot && <StarIcon percent={comment.rating * 20} size="16" />}
          </div>
          <div>{comment.content}</div>
        </div>

        {/* Actions */}
        <div className="flex text-sm gap-4">
          <span>{formatTimeComment(comment.comment_at)}</span>
          <ReactionButton
            onReaction={(reaction) => handleReaction(comment._id, reaction)}
            currentReaction={comment?.userReaction} // reaction hiện tại của user
            reactionCount={comment?.reactionCount} // tổng số reactions
          />
          <button onClick={() => onToggleReplication(comment._id)}>
            Phản hồi
          </button>
        </div>
      </div>
    </div>
  );
};

// Component form trả lời chung
const ReplyForm = ({ comment, onSubmit, placeholder }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      // Trigger form submit
      e.target.closest("form").requestSubmit();
    }
    // Shift+Enter sẽ tự động xuống dòng (behavior mặc định)
  };

  return (
    <div className="pt-2 pl-10 relative before:w-6 before:h-[calc(100%/2+4px)] before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[15px] before:top-0">
      <form
        action={async (form) => {
          const body = Object.fromEntries(form);
          body.comment_id = comment._id;
          onSubmit(body);
        }}
        className="flex items-center bg-gray-100 p-2 rounded-xl"
      >
        <textarea
          id={comment._id}
          name="content"
          className="w-full bg-transparent outline-none appearance-none resize-none"
          placeholder={placeholder || `Trả lời ${comment?.customer?.last_name}`}
          onKeyDown={handleKeyDown}
        />
        <button className="text-active">
          <Send />
        </button>
      </form>
    </div>
  );
};

// Component loading chung
const LoadingSection = () => (
  <>
    <div className="mb-2">
      <Skeleton width="30%" className="mb-2" height="24px" />
      <Skeleton width="70%" className="mb-2" height="50px" />
    </div>
    <div>
      <Skeleton width="30%" className="mb-2" height="24px" />
      <Skeleton width="70%" className="mb-2" height="50px" />
    </div>
  </>
);

// Component hiển thị comment con đã được tối ưu
const RenderCommentChilds = ({ comment, onShow }) => {
  const { loadComments } = useCommentActions();
  const {
    comments: commentsChilds,
    setComments: setCommentsChilds,
    total,
    page,
    setPage,
    focusComment,
    isPending,
    startTransition,
    toggleReplication,
    addNewComments,
  } = useCommentState(
    comment?.childs?.items || [],
    comment?.childs?.total || 0
  );

  const [commentData, setCommentData] = useState(comment);
  const { handleSubmitReply } = useCommentActions();

  // Focus effect
  useEffect(() => {
    if (focusComment) {
      const element = document.getElementById(`${focusComment}`);
      element?.focus();
    }
  }, [focusComment]);

  // Load more comments effect
  useEffect(() => {
    if (page <= 1) return;

    const getComment = async () => {
      const response = await loadComments({
        comment_id: commentData._id,
        page,
      });

      if (response.status === 200) {
        addNewComments(response.data.comments, response.data.total);
      }
    };

    startTransition(async () => {
      await getComment();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleShowCommentChild = () => {
    onShow(comment._id);
    setCommentData({
      ...commentData,
      showComment: true,
    });
  };

  const shouldShowVerticalLine = (index) => {
    return index < commentsChilds.length - 1 || total > commentsChilds?.length;
  };

  const getCommentClasses = (index) => {
    const baseClasses =
      "pl-10 relative pt-2 before:w-6 before:h-6 before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[15px] before:top-0";
    const lineClasses =
      "after:w-[2px] after:h-full after:content-[''] after:top-0 after:left-[15px] after:absolute after:bg-gray-200";

    return `${baseClasses} ${shouldShowVerticalLine(index) ? lineClasses : ""}`;
  };

  return (
    <div>
      {commentData.showComment ? (
        <>
          {commentsChilds?.map((childComment, index) => (
            <div key={childComment._id} className={getCommentClasses(index)}>
              <CommentItem
                comment={childComment}
                onToggleReplication={toggleReplication}
                onSubmitReply={handleSubmitReply}
                showVerticalLine={
                  childComment?.childs?.total > 0 ||
                  childComment?.showReplication
                }
              />

              {/* Render comment con của comment con (đệ quy) */}
              {childComment?.childs.total > 0 && (
                <div className="relative">
                  {childComment?.showReplication && (
                    <div className="w-[2px] bg-gray-200 h-[calc(100%)] absolute top-[0] left-[15px]"></div>
                  )}
                  <RenderCommentChilds comment={childComment} onShow={onShow} />
                </div>
              )}

              {/* Form trả lời */}
              {childComment?.showReplication && (
                <ReplyForm
                  comment={childComment}
                  onSubmit={handleSubmitReply}
                />
              )}
            </div>
          ))}

          {/* Loading hoặc load more */}
          {isPending ? (
            <LoadingSection />
          ) : (
            total > commentsChilds?.length && (
              <button
                className="pl-10 relative before:content-[''] before:w-6 before:h-4 before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[14.5px] before:top-0"
                onClick={() => setPage(page + 1)}
              >
                Xem thêm phản hồi
              </button>
            )
          )}
        </>
      ) : (
        <button
          className={`relative py-1 before:content-[''] before:w-6 before:h-4 before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[14.5px] before:top-0 pl-10 ${
            comment?.showReplication
              ? "after:w-[2px] after:h-full after:content-[''] after:top-0 after:left-[14.5px] after:absolute after:bg-gray-200"
              : ""
          }`}
          onClick={handleShowCommentChild}
        >
          Xem tất cả {commentData.childs.total} phản hồi
        </button>
      )}
    </div>
  );
};

// Component chính đã được tối ưu
const CommentContent = () => {
  const { setShowModel } = useContext(CommentContext);
  const { loadComments, handleSubmitReply } = useCommentActions();
  const {
    comments,
    total,
    page,
    setPage,
    focusComment,
    isPending,
    startTransition,
    toggleReplication,
    showChild,
    addNewComments,
  } = useCommentState();

  // Load comments effect
  useEffect(() => {
    const getComment = async () => {
      const response = await loadComments({ page });

      if (response.status === 200) {
        addNewComments(response.data.comments, response.data.total);
      }
    };

    startTransition(async () => {
      await getComment();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Focus effect
  useEffect(() => {
    if (focusComment) {
      const element = document.getElementById(`${focusComment}`);
      element?.focus();
    }
  }, [focusComment]);

  return (
    <div className="p-4 text-orange-400">
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="text-2xl">Bình luận sản phẩm</h3>
        <div>
          <button
            className="bg-yellow-500 px-5 py-2 rounded-md"
            onClick={() => setShowModel(true)}
          >
            Đánh giá
          </button>
        </div>
      </div>

      {/* Danh sách comment chính */}
      <div className="flex flex-col gap-2">
        {comments?.map((comment) => (
          <div key={comment._id}>
            {/* Comment chính */}
            <CommentItem
              comment={comment}
              isRoot={true}
              onToggleReplication={toggleReplication}
              onSubmitReply={handleSubmitReply}
              showVerticalLine={
                comment?.childs?.total > 0 || comment?.showReplication
              }
            />

            {/* Comment con và đường kẻ dọc */}
            <div className="relative">
              {comment?.showReplication && (
                <div className="w-[2px] bg-gray-200 h-[calc(100%)] absolute top-[0] left-[15px]"></div>
              )}
              {comment?.childs?.total > 0 && (
                <RenderCommentChilds comment={comment} onShow={showChild} />
              )}
            </div>

            {/* Form trả lời comment chính */}
            {comment?.showReplication && (
              <ReplyForm comment={comment} onSubmit={handleSubmitReply} />
            )}
          </div>
        ))}

        {/* Loading hoặc load more */}
        {isPending ? (
          <LoadingSection />
        ) : (
          total > comments?.length && (
            <div>
              <button onClick={() => setPage(page + 1)}>Tải thêm</button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CommentContent;
