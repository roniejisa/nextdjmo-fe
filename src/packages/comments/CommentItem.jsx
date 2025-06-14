"use client";
import { memo, useState } from "react";
import StarIcon from "./StarIcon";
import ImageCustom from "@/components/Maintain/Image";
import ReactionButton from "./ReactionButton";
import { formatTimeComment, showImageUrl } from "@/utils/client";

const CommentItem = ({
  comment,
  isRoot = false,
  onToggleReplication,
  showVerticalLine = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`
        flex gap-4 relative group transition-all duration-300 ease-out
        hover:transform
        ${isHovered ? "z-10" : "z-0"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar với hiệu ứng 3D */}
      <div className="relative flex-shrink-0">
        <div
          className={`
          relative w-12 h-12 rounded-full
          ring-4 ring-white shadow-lg
          z-20
          transition-all duration-300 ease-out
          ${
            isHovered
              ? "ring-blue-200 shadow-xl transform scale-110"
              : "ring-gray-100"
          }
          before:absolute before:inset-0 before:rounded-full 
          before:bg-gradient-to-br before:from-white/20 before:to-transparent
          before:z-10 before:pointer-events-none
        `}
        >
          <ImageCustom
            src={showImageUrl(comment?.customer?.avatar)}
            alt={comment?.customer?.last_name}
            fill={true}
            className="rounded-full object-cover relative z-20"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 z-10 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Vertical line với gradient */}
        {showVerticalLine && (
          <div
            className={`
            w-0.5 bg-gradient-to-b from-blue-400 via-purple-300 to-green-200
            ${
              comment.childs?.total > 0 || comment.showReplication
                ? "h-[calc(100%-48px)]"
                : "h-[calc(100%-60px)]"
            } absolute top-14 left-1/2 -translate-x-1/2
            transition-all duration-500 ease-out
          `}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Comment content với glassmorphism */}
      <div className="flex-1 min-w-0">
        <div
          className={`
          relative bg-white/80 backdrop-blur-sm border border-white/20
          rounded-2xl p-4 mb-3 shadow-sm
          transition-all duration-300 ease-out
          hover:shadow-xl hover:bg-white/90 hover:border-white/40
          before:absolute before:inset-0 before:rounded-2xl
          before:bg-gradient-to-br before:from-white/10 before:to-transparent
          before:pointer-events-none
          ${isHovered ? "transform translate-y-[-2px] shadow-2xl" : ""}
        `}
        >
          {/* Header with user info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800 text-lg">
                {comment?.customer?.last_name}
              </span>
              {isRoot && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full border border-amber-100">
                  <StarIcon percent={comment.rating * 20} size="14" />
                  <span className="text-xs font-medium text-amber-700">
                    {comment.rating}/5
                  </span>
                </div>
              )}
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                {formatTimeComment(comment?.comment_at)}
              </span>
            </div>
          </div>

          {/* Comment content */}
          <div className="text-gray-700 leading-relaxed mb-3">
            {comment.content}
          </div>

          {/* Actions bar */}
          <div
            className={`
            flex items-center gap-4 transition-all duration-300
            ${isHovered ? "opacity-100 transform translate-y-0" : "opacity-70"}
          `}
          >
            <ReactionButton
              comment={comment}
            />

            <button
              onClick={() => onToggleReplication(comment._id)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full
                text-sm font-medium text-gray-600
                bg-gray-50 hover:bg-blue-50 hover:text-blue-600
                border border-gray-200 hover:border-blue-200
                transition-all duration-200
                transform hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Phản hồi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default memo(CommentItem);
