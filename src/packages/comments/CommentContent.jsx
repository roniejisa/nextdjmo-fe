"use client";

import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { CommentContext } from "./CommentProvider";
import StarIcon from "./StarIcon";
import { getDataComment, submitReview } from "./action";
import Skeleton from "@/components/Skeleton/Skeleton";
import ImageCustom from "@/components/Maintain/Image";
import { formatTimeComment, showImageUrl } from "@/utils/client/util";
import Send from "@/components/Icon/svg/Send";
import useRouterCustom from "../translation/Navigation";
import { useNotify } from "@/context/NotifyProvider";
import { usePathname } from "next/navigation";

const RenderCommentChilds = ({ comment, onShow }) => {
  const { showModel, setShowModel, type, id } = useContext(CommentContext);
  const [commentData, setCommentData] = useState(comment);
  const [commentsChilds, setCommentsChilds] = useState(
    comment?.childs?.items || []
  );
  const [isPending, startTransition] = useTransition();
  const [total, setTotal] = useState(comment?.childs?.total || 0);
  const [page, setPage] = useState(1);
  const router = useRouterCustom();
  const notify = useNotify();
  const pathname = usePathname();
  const [focusComment, setFocusComment] = useState(null);

  const handleShowCommentChild = () => {
    onShow(comment._id);
    setCommentData({
      ...commentData,
      showComment: true,
    });
  };

  const handleShowReplication = (comment_id) => {
    setCommentsChilds((prev) => {
      return prev.map((commentItem) => {
        if (commentItem._id === comment_id) {
          return {
            ...commentItem,
            showReplication: !commentItem.showReplication,
          };
        }
        return commentItem;
      });
    });

    commentsChilds.forEach((comment) => {
      if (comment._id === comment_id) {
        if (!comment.showReplication) {
          setFocusComment(comment_id);
        } else {
          setFocusComment(null);
        }
      }
    });
  };

  useEffect(() => {
    if (focusComment) {
      const item = document.getElementById(`${focusComment}`);
      if (item) {
        item.focus();
      }
    }
  }, [focusComment]);

  const handleSubmitReplication = async (body) => {
    body.type = type;
    body.id = id;
    const response = await submitReview(body);
    if (response.status == 401) {
      router.push("/dang-nhap?redirect=" + pathname);
      notify.changeNotify("error", response.message);
    } else if (response.status == 200) {
      notify.changeNotify("success", response.message);
    }
  };

  const showChild = (comment_id) => {
    setCommentsChilds((prev) => {
      return prev.map((comment) => {
        if (comment._id === comment_id) {
          return {
            ...comment,
            showChild: true,
          };
        }
        return comment;
      });
    });
  };

  useEffect(() => {
    if (page <= 1) return;
    const getComment = async () => {
      const response = await getDataComment({
        comment_id: commentData._id,
        type,
        id,
        page,
      });
      if (response.status == 200) {
        setTotal(response.data.total);
        setCommentsChilds((prev) => {
          const newComments = response.data.comments.filter((item) => {
            return !prev.some((comment) => {
              return comment._id === item._id;
            });
          });
          return [...prev, ...newComments];
        });
      }
    };
    startTransition(async () => {
      await getComment();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  return (
    <div>
      {commentData.showComment ? (
        <>
          {commentsChilds?.map((comment, index) => {
            return (
              <div
                key={comment._id}
                className={`pl-10 relative pt-2 before:w-6 before:h-6 before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[15px] before:top-0 ${
                  index < commentsChilds.length - 1 ||
                  total > commentsChilds?.length
                    ? "after:w-[2px] after:h-full after:content-[''] after:top-0 after:left-[15px] after:absolute after:bg-gray-200"
                    : ""
                } `}
              >
                <div className="">
                  <div className="flex gap-2 relative">
                    <div className="relative">
                      <span className="relative w-8 h-8 block">
                        <ImageCustom
                          src={showImageUrl(comment?.customer?.avatar)}
                          alt={comment?.customer?.last_name}
                          fill={true}
                          className="rounded-full"
                        />
                      </span>
                      {(comment?.childs?.total > 0 ||
                        comment?.showReplication) && (
                        <div className="w-[2px] bg-gray-200 h-[calc(100%-32px)] absolute top-[32px] left-1/2 -translate-x-1/2"></div>
                      )}
                    </div>
                    <div className={`relative`}>
                      <div className="bg-gray-100 p-2 rounded-xl mb-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-medium">
                            {comment?.customer?.last_name}
                          </span>
                        </div>
                        <div>{comment.content}</div>
                      </div>
                      <div className="">
                        <div className="flex text-sm gap-4">
                          <span>{formatTimeComment(comment.comment_at)}</span>
                          <button>Thích</button>
                          <button
                            onClick={() => handleShowReplication(comment._id)}
                          >
                            Phản hồi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {comment?.childs.total > 0 ? (
                  <div className="relative">
                    {comment?.showReplication && (
                      <div className="w-[2px] bg-gray-200 h-[calc(100%)] absolute top-[0] left-[15px]"></div>
                    )}
                    <RenderCommentChilds comment={comment} onShow={showChild} />
                  </div>
                ) : (
                  ""
                )}
                {comment?.showReplication && (
                  <div className="pt-2 pl-10 relative before:w-6 before:h-[calc(100%/2+4px)] before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[15px] before:top-0">
                    <form
                      action={async (form) => {
                        const body = Object.fromEntries(form);
                        body.comment_id = comment._id;
                        handleSubmitReplication(body);
                      }}
                      className="flex items-center bg-gray-100 p-2 rounded-xl"
                    >
                      <textarea
                        id={comment._id}
                        name="content"
                        className="w-full bg-transparent outline-none appearance-none resize-none"
                        placeholder={`Trả lời ${comment?.customer?.last_name}`}
                      ></textarea>
                      <button className="text-active">
                        <Send />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
          {isPending ? (
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
const CommentContent = () => {
  const { showModel, setShowModel, type, id } = useContext(CommentContext);
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const router = useRouterCustom();
  const notify = useNotify();
  const pathname = usePathname();
  const [focusComment, setFocusComment] = useState(null);

  useEffect(() => {
    const getComment = async () => {
      const response = await getDataComment({
        type,
        id,
        page,
      });

      if (response.status == 200) {
        setTotal(response.data.total);
        setComments((prev) => {
          const newComments = response.data.comments.filter((item) => {
            return !prev.some((comment) => {
              return comment._id === item._id;
            });
          });
          return [...prev, ...newComments];
        });
      }
    };
    startTransition(async () => {
      await getComment();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleShowReplication = (comment_id) => {
    setComments((prev) => {
      return prev.map((comment) => {
        if (comment._id === comment_id) {
          return {
            ...comment,
            showReplication: !comment.showReplication,
          };
        }
        return comment;
      });
    });

    comments.forEach((comment) => {
      if (comment._id === comment_id) {
        if (!comment.showReplication) {
          setFocusComment(comment_id);
        } else {
          setFocusComment(null);
        }
      }
    });
  };

  useEffect(() => {
    if (focusComment) {
      const item = document.getElementById(`${focusComment}`);
      if (item) {
        item.focus();
      }
    }
  }, [focusComment]);

  const handleSubmitReplication = async (body) => {
    body.type = type;
    body.id = id;
    const response = await submitReview(body);
    if (response.status == 401) {
      router.push("/dang-nhap?redirect=" + pathname);
      notify.changeNotify("error", response.message);
    } else if (response.status == 200) {
      notify.changeNotify("success", response.message);
    }
  };

  const showChild = (comment_id) => {
    setComments((prev) => {
      return prev.map((comment) => {
        if (comment._id === comment_id) {
          return {
            ...comment,
            showChild: true,
          };
        }
        return comment;
      });
    });
  };

  return (
    <div className="p-4">
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
      <div className="flex flex-col gap-2">
        {comments?.map((comment) => {
          return (
            <div key={comment._id}>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="relative block w-8 h-8">
                    <ImageCustom
                      src={showImageUrl(comment?.customer?.avatar)}
                      alt={comment?.customer?.last_name}
                      fill={true}
                      className="rounded-full"
                    />
                  </span>
                  {(comment?.childs?.total > 0 || comment?.showReplication) && (
                    <div className="w-[2px] bg-gray-200 h-[calc(100%-32px)] absolute top-[32px] left-1/2 -translate-x-1/2"></div>
                  )}
                </div>
                <div className={`relative : ""}`}>
                  <div className="bg-gray-100 p-2 rounded-xl mb-2 ">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-medium">
                        {comment?.customer?.last_name}
                      </span>
                      <StarIcon percent={comment.rating * 20} size="16" />
                    </div>
                    <div>{comment.content}</div>
                  </div>
                  <div className="action">
                    <div className="flex text-sm gap-4">
                      <span>{formatTimeComment(comment.comment_at)}</span>
                      <button>Thích</button>
                      <button
                        onClick={() => handleShowReplication(comment._id)}
                      >
                        Phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                {comment?.showReplication && (
                  <div className="w-[2px] bg-gray-200 h-[calc(100%)] absolute top-[0] left-[15px]"></div>
                )}
                {comment?.childs?.total > 0 ? (
                  <RenderCommentChilds comment={comment} onShow={showChild} />
                ) : (
                  ""
                )}
              </div>
              {comment?.showReplication && (
                <div className="pt-2 pl-10 relative before:w-6 before:h-[calc(100%/2+4px)] before:border-2 before:border-r-0 before:rounded-bl-xl before:border-t-0 before:absolute before:left-[15px] before:top-0">
                  <form
                    action={async (form) => {
                      const body = Object.fromEntries(form);
                      body.comment_id = comment._id;
                      handleSubmitReplication(body);
                    }}
                    className="bg-gray-100 p-2 flex items-center rounded-xl"
                  >
                    <textarea
                      id={comment._id}
                      name="content"
                      className="w-full bg-transparent outline-none appearance-none resize-none"
                      placeholder={`Trả lời ${comment?.customer?.last_name}`}
                    ></textarea>
                    <button className="text-active">
                      <Send />
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
        {isPending ? (
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
        ) : (
          <>
            {total > comments?.length && (
              <div>
                <button onClick={() => setPage(page + 1)}>Tải thêm</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentContent;