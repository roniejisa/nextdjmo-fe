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
  const { type, id } = useContext(CommentContext);

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
    <div className="mr">
      {/* Header với glassmorphism và socket status indicator */}
      <div className="mr-header">
        <div className="mr-header-container">
          <div className="mr-header-left">
            <div className="mr-header-icon">
              <svg
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
            <div className="mr-header-info">
              <div className="mr-header-info-top">
                <h3 className="mr-header-info-title">
                  Bình luận sản phẩm
                </h3>
                {/* Socket connection indicator */}
                <div className={`mr-socket-status ${socketConnected ? 'mr-socket-status--online' : 'mr-socket-status--offline'}`}>
                  <div className={`mr-socket-status-dot ${socketConnected ? 'mr-socket-status-dot--online' : 'mr-socket-status-dot--offline'}`} />
                  {socketConnected ? "Online" : "Offline"}
                </div>
              </div>
              <p className="mr-header-info-description">
                {total} bình luận • Chia sẻ trải nghiệm của bạn
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModel(true)}
            className="mr-rating-btn"
          >
            <span className="mr-rating-btn-content">
              <svg
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

      {/* Modal Overlay */}
      <div
        ref={modelRef}
        onClick={handleShowModel}
        className={`mr-overlay ${showModel && !isClosing ? 'mr-overlay--show' : 'mr-overlay--hide'}`}
      >
        {/* Modal Container */}
        <div
          className={`mr-modal ${showModel && !isClosing ? 'mr-modal--show' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mr-modal-header">
            <h3 className="mr-modal-header-title">
              Đánh giá sản phẩm
            </h3>
            <button
              type="button"
              onClick={handleCloseModal}
              className="mr-modal-close-btn"
            >
              <svg
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
          <form className="mr-form" action={handleSubmitFormReview} ref={formRef}>
            {/* Star Rating Section */}
            <div className="mr-form-star-section">
              <p className="mr-form-star-section-label">
                Chọn số sao để đánh giá
              </p>
              <div className="mr-form-star-section-container">
                <StarInput reset={reset} size="48" setReset={setReset} />
              </div>
            </div>

            {/* Comment Textarea */}
            <div className="mr-form-textarea-section">
              <label className="mr-form-textarea-section-label">
                Nhận xét của bạn
              </label>
              <div className="mr-form-textarea-section-container">
                <textarea
                  className="mr-form-textarea-section-textarea"
                  name="content"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  required
                />
                <div className="mr-form-textarea-section-overlay"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mr-form-actions">
              <button
                type="button"
                className="mr-btn mr-btn--cancel"
                onClick={handleCloseModal}
                disabled={isPending}
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="mr-btn mr-btn--submit"
              >
                {isPending ? (
                  <>
                    <svg
                      className="mr-btn--submit-spinner"
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
    </div>
  );
};

export default ModalRating;