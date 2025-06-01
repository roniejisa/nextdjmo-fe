"use client";
import LikeIcon from "@/components/Icon/svg/Like";
import { useRef, useState } from "react";

const { reactions } = require("./ReactionIcon");

export const ReactionButton = ({
  onReaction,
  currentReaction = null,
  reactionCount = 0,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(currentReaction);
  const [count, setCount] = useState(reactionCount);
  const timeoutRef = useRef();
  const containerRef = useRef();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 300);
  };

  const handleReactionSelect = (reaction) => {
    if (selectedReaction === reaction.type) {
      // Bỏ reaction nếu đã chọn
      setSelectedReaction(null);
      setCount((prev) => Math.max(0, prev - 1));
      onReaction?.(null);
    } else {
      // Chọn reaction mới
      const wasSelected = selectedReaction !== null;
      setSelectedReaction(reaction.type);
      setCount((prev) => (wasSelected ? prev : prev + 1));
      onReaction?.(reaction.type);
    }
    setShowReactions(false);
  };

  const getCurrentReaction = () => {
    return reactions.find((r) => r.type === selectedReaction);
  };

  const currentReactionData = getCurrentReaction();

  return (
    <div
      className="relative inline-block"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reactions popup */}
      <div
        className={`
        absolute bottom-full left-0 mb-2 
        bg-white rounded-full shadow-lg border border-gray-200
        flex items-center gap-1 p-2
        transition-all duration-300 ease-out
        ${
          showReactions
            ? "opacity-100 transform scale-100 translate-y-0"
            : "opacity-0 transform scale-75 translate-y-2 pointer-events-none"
        }
      `}
      >
        {reactions.map((reaction, index) => (
          <button
            key={reaction.type}
            onClick={() => handleReactionSelect(reaction)}
            data-type={reaction.type}
            className={`reaction-icon outline-none`}
            title={reaction.name}
          >
            {reaction.icon}
            {/* Tooltip */}
            <div className="reaction-tooltip">{reaction.name}</div>
          </button>
        ))}
      </div>

      {/* Main button */}
      <button
        onClick={() =>
          selectedReaction
            ? handleReactionSelect(getCurrentReaction())
            : handleReactionSelect(reactions[0])
        }
        className={`
          relation-icon
          flex items-center gap-1 px-2 py-1 rounded
          transition-all duration-200 text-sm font-medium
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${
            selectedReaction
              ? "text-blue-600 selected"
              : "text-gray-600 hover:text-blue-600"
          }
        `}
      >
        {currentReactionData ? (
          <>
            <span
              style={{ color: currentReactionData.color }}
              data-type={selectedReaction}
              className="mr-2"
            >
              {currentReactionData.icon}
            </span>
            <span style={{ color: currentReactionData.color }}>
              {currentReactionData.name}
            </span>
          </>
        ) : (
          <>
            <span className="text-blue-300">
              <LikeIcon className="w-5 h-5" />
            </span>
            <span className="text-blue-300">Thích</span>
          </>
        )}
        {count > 0 && (
          <span className="text-xs text-gray-400 ml-1">{count}</span>
        )}
      </button>
    </div>
  );
};
