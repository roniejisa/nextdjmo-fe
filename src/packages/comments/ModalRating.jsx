"use client";
import { useContext, useRef, useState, useTransition } from "react";
import StarInput from "./StarInput";
import { submitReview } from "./action";
import { usePathname } from "next/navigation";
import useRouterCustom from "../translation/Navigation";
import { useNotify } from "@/context/NotifyProvider";
import { SocketContext } from "@/context/SocketProvider";
import { CommentContext } from "./CommentProvider";

const ModalRating = ({ socketConnected, total }) => {
  const [showModel, setShowModel] = useState(false);
  const {type, id} = useContext(CommentContext)

  const pathname = usePathname();
  const router = useRouterCustom();
  const notify = useNotify();
  const modelRef = useRef(null);
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [reset, setReset] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { socketRef, sessionIdRef } = useContext(SocketContext);
  const handleSubmitFormReview = async (form) => {
    startTransition(async () => {
      const body = Object.fromEntries(form);
      (body.type = type), (body._id = id);
      const response = await submitReview(body);
      if (response.status == 401) {
        notify.changeNotify("error", response.message);
        return router.pushWithQuery("/dang-nhap", {
          redirect: pathname,
        });
      } else if (response.status == 200) {
        formRef.current.reset();
        notify.changeNotify("success", response.message);
        handleCloseModal();
        setReset(true);
      } else {
        notify.changeNotify("error", response.message);
      }

      if (socketRef.current) {
        socketRef.current.sendEncode({
          type: "new-comment",
          data: {
            module: type,
            module_id: id,
            comment: response.data,
            user_id: sessionIdRef.current,
          },
        });
      }
    });
  };

  const handleShowModel = (e) => {
    if (e.target.contains(modelRef.current)) {
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModel(false);
      setIsClosing(false);
    }, 200);
  };
  return (
    <>
      {/* Header với glassmorphism và socket status indicator */}
      <div
        className={`
                relative bg-white/80 backdrop-blur-sm border border-white/20
                rounded-3xl p-6 mb-8 shadow-lg
                before:absolute before:inset-0 before:rounded-3xl
                before:bg-gradient-to-br before:from-white/10 before:to-transparent
                before:pointer-events-none
              `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Bình luận sản phẩm
                </h3>
                {/* Socket connection indicator */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    socketConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      socketConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {socketConnected ? "Online" : "Offline"}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {total} bình luận • Chia sẻ trải nghiệm của bạn
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModel(true)}
            className={`
                      relative px-6 py-3 rounded-2xl font-semibold text-white
                      bg-gradient-to-r from-amber-500 to-orange-500
                      hover:from-amber-600 hover:to-orange-600
                      transform hover:scale-105 active:scale-95
                      transition-all duration-300 ease-out
                      shadow-lg hover:shadow-xl
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Đánh giá
            </span>
          </button>
        </div>
      </div>
      <div
        ref={modelRef}
        onClick={handleShowModel}
        className={`
            fixed top-0 left-0 w-full h-full z-[9999]
            bg-black/30 backdrop-blur-sm
            flex justify-center items-center cursor-pointer
            transition-all duration-300 ease-out
            ${
              showModel && !isClosing
                ? "opacity-100 pointer-events-auto visible"
                : "opacity-0 pointer-events-none invisible"
            }
            `}
      >
        {/* Modal Container */}
        <div
          className={`
                relative bg-white/90 backdrop-blur-xl border border-white/20
                rounded-3xl shadow-2xl w-full max-w-[600px] mx-4
                transform transition-all duration-300 ease-out
                before:absolute before:inset-0 before:rounded-3xl
                before:bg-gradient-to-br before:from-white/20 before:to-transparent
                before:pointer-events-none
                ${
                  showModel && !isClosing
                    ? "scale-100 translate-y-0 opacity-100"
                    : "scale-95 translate-y-4 opacity-0"
                }
            `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-100/50">
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              Đánh giá sản phẩm
            </h3>
            <button
              type="button"
              onClick={handleCloseModal}
              className={`
                    absolute top-4 right-4 w-8 h-8 
                    rounded-full bg-gray-100 hover:bg-gray-200
                    flex items-center justify-center
                    transition-all duration-200 ease-out
                    hover:transform hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-gray-300/50
                `}
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form className="p-6" action={handleSubmitFormReview} ref={formRef}>
            {/* Star Rating Section */}
            <div className="flex flex-col items-center mb-6">
              <p className="text-gray-600 mb-4 text-sm">
                Chọn số sao để đánh giá
              </p>
              <div
                className={`
                    p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50
                    border border-amber-100/50 shadow-inner
                `}
              >
                <StarInput reset={reset} size="48" setReset={setReset} />
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét của bạn
              </label>
              <div className="relative">
                <textarea
                  className={`
                        w-full h-32 p-4 rounded-2xl border border-gray-200
                        bg-white/80 backdrop-blur-sm
                        resize-none outline-none
                        placeholder:text-gray-400
                        transition-all duration-300 ease-out
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300
                        focus:bg-white/90 focus:shadow-lg
                        hover:border-gray-300 hover:bg-white/85
                    `}
                  name="content"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  required
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`
                    px-6 py-3 rounded-xl font-medium text-sm
                    bg-gray-100 hover:bg-gray-200 text-gray-700
                    border border-gray-200 hover:border-gray-300
                    transition-all duration-200 ease-out
                    transform hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-gray-300/50
                    `}
                onClick={handleCloseModal}
                disabled={isPending}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`
                    px-6 py-3 rounded-xl font-medium text-sm
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    hover:from-blue-600 hover:to-indigo-700
                    text-white border-0 shadow-lg hover:shadow-xl
                    transition-all duration-200 ease-out
                    transform hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:transform-none disabled:hover:scale-100
                    flex items-center gap-2
                    `}
              >
                {isPending ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Gửi đánh giá
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ModalRating;
