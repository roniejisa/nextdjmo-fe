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
      className={`ci-comment-container ${isHovered ? 'ci-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar với hiệu ứng 3D */}
      <div className="ci-avatar-wrapper">
        <div className={`ci-avatar-container ${isHovered ? 'ci-hovered' : ''}`}>
          <ImageCustom
            src={showImageUrl(comment?.customer?.avatar)}
            alt={comment?.customer?.last_name}
            fill={true}
            className="ci-avatar-image"
          />
          {/* Online indicator */}
          <div className="ci-online-indicator">
            <div className="ci-pulse"></div>
          </div>
        </div>

        {/* Vertical line với gradient */}
        {showVerticalLine && (
          <div
            className={`ci-vertical-line ${
              comment.childs?.total > 0 || comment.showReplication
                ? 'ci-with-replies'
                : 'ci-without-replies'
            }`}
          />
        )}
      </div>

      {/* Comment content với glassmorphism */}
      <div className="ci-content-wrapper">
        <div className={`ci-comment-bubble ${isHovered ? 'ci-hovered' : ''}`}>
          {/* Header with user info */}
          <div className="ci-header">
            <div className="ci-user-info">
              <span className="ci-user-name">
                {comment?.customer?.last_name}
              </span>
              {isRoot && (
                <div className="ci-rating-badge">
                  <StarIcon percent={comment.rating * 20} size="14" />
                  <span className="ci-rating-text">
                    {comment.rating}/5
                  </span>
                </div>
              )}
              <span className="ci-timestamp">
                {formatTimeComment(comment?.comment_at)}
              </span>
            </div>
          </div>

          {/* Comment content */}
          <div className="ci-content">
            {comment.content}
          </div>

          {/* Actions bar */}
          <div className={`ci-actions ${isHovered ? 'ci-hovered' : ''}`}>
            <ReactionButton comment={comment} />

            <button
              onClick={() => onToggleReplication(comment._id)}
              className="ci-reply-button"
            >
              <svg
                className="ci-reply-icon"
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