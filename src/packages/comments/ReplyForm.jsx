"use client";
import { useEffect, useRef, useState } from "react";

export const ReplyForm = ({
  comment,
  onSubmit,
  placeholder,
  checkFocus = false,
}) => {
  const [content, setContent] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const formRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (formRef.current && checkFocus) {
      // Focus vào textarea
      formRef.current.focus();
      
      // Scroll mượt mà đến vị trí form sau một delay nhỏ
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // Đưa form vào giữa viewport
            inline: 'nearest'
          });
        }
      }, 100); // Delay nhỏ để đảm bảo DOM đã render xong
    }
  }, [checkFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    const body = {
      content: content,
      comment_id: comment._id,
    };

    try {
      await onSubmit(body);
      setContent("");
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <div className="relative mt-3" ref={containerRef}>
      {/* Horizontal connector line - đồng bộ với RenderCommentChilds */}
      <div
        className={`
        absolute w-6 h-0.5 bg-gradient-to-r from-blue-200/60 to-blue-300/80 
        left-[-40px] top-4
        transition-all duration-300
        ${isHovered || isFocused ? "from-blue-400/80 to-blue-500/90" : ""}
      `}
      />

      {/* Connection dot */}
      <div
        className={`
        absolute w-2 h-2 bg-blue-300/80 rounded-full 
        left-[-37px] top-[13px] border-2 border-white shadow-sm
        transition-all duration-300
        ${isHovered || isFocused ? "bg-blue-500/90 scale-110" : ""}
      `}
      />

      <div
        className={`
          relative bg-white/70 backdrop-blur-sm border border-gray-200/60
          rounded-2xl p-4 shadow-sm
          transition-all duration-300 ease-out
          ${
            isFocused
              ? "shadow-lg bg-white/90 border-blue-200/80 ring-2 ring-blue-100/50"
              : isHovered
              ? "shadow-md bg-white/80 border-gray-300/60"
              : ""
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
            <svg
              className="w-3 h-3 text-white"
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
          <span className="text-sm font-medium text-gray-600">
            Phản hồi @{comment?.customer?.last_name}
          </span>
        </div>

        {/* Input area */}
        <div
          className={`
          flex items-end gap-3 bg-gray-50/60 backdrop-blur-sm
          rounded-xl p-3 border border-gray-100/60
          transition-all duration-300 ease-out
          ${
            isFocused
              ? "bg-blue-50/60 border-blue-200/70"
              : "hover:bg-gray-50/80"
          }
        `}
        >
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`
                w-full bg-transparent outline-none resize-none
                text-gray-700 placeholder-gray-400
                min-h-[36px] max-h-[100px] leading-relaxed text-sm
              `}
              placeholder={placeholder || "Nhập phản hồi..."}
              onKeyDown={handleKeyDown}
              rows="1"
              ref={formRef}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className={`
              relative flex items-center justify-center
              w-9 h-9 rounded-lg flex-shrink-0
              transition-all duration-200 ease-out
              transform hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-blue-500/30
              ${
                content.trim()
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700"
                  : "bg-gray-200/60 text-gray-400 cursor-not-allowed"
              }
            `}
          >
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
          </button>
        </div>

        {/* Helper text */}
        {(content.length > 0 || isFocused) && (
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>{content.length}/500 ký tự</span>
            <span className="opacity-70">
              Enter để gửi • Shift+Enter xuống dòng
            </span>
          </div>
        )}
      </div>
    </div>
  );
};