"use client";
import LikeIcon from "@/components/Icon/svg/Like";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SocketContext } from "@/context/SocketProvider";
import { CommentContext } from "./CommentProvider";
import { reactions } from "./ReactionIcon";
import { ClientContext } from "@/context/client/ClientProvider";
import { submitReaction } from "./action";
import useRouterCustom from "../translation/Navigation";
import { usePathname } from "next/navigation";
import { useNotify } from "@/context/NotifyProvider";

const ReactionButton = ({ comment }) => {
  const { socketRef, sessionIdRef } = useContext(SocketContext);
  const { type, id } = useContext(CommentContext);
  const { profile } = useContext(ClientContext);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const count = useMemo(() => {
    return comment.reactions.length;
  }, [comment]);

  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef();
  const containerRef = useRef();
  const panelRef = useRef();
  const hideTimeoutRef = useRef();
  const router = useRouterCustom();
  const pathname = usePathname();
  const notify = useNotify();

  const getReactionCurrent = useCallback(() => {
    const reactionOfUser = comment.reactions.find(
      (reaction) => reaction.customer_id == profile?.user?._id
    );
    return reactionOfUser;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  useLayoutEffect(() => {
    const reactionCurrent = getReactionCurrent();
    setSelectedReaction(reactionCurrent?.type ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);
  // Setup auto-hide functionality
  useEffect(() => {
    const container = containerRef.current;
    const panel = panelRef.current;

    if (!container || !panel) return;

    const handleReactionClick = (e) => {
      // Kiểm tra nếu click vào reaction icon
      if (e.target.closest(".reaction-icon")) {
        // Thêm class để ẩn panel ngay lập tức
        panel.classList.add("force-hidden");

        // Set timeout để remove class sau một khoảng thời gian ngắn
        // Điều này cho phép panel có thể hiện lại khi hover
        hideTimeoutRef.current = setTimeout(() => {
          panel.classList.remove("force-hidden");
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      // Clear timeout nếu đang ẩn
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      // Remove class ẩn nếu có
      panel.classList.remove("force-hidden");
    };

    const handleMouseLeave = () => {
      // Có thể thêm delay nhỏ trước khi ẩn hoàn toàn
      hideTimeoutRef.current = setTimeout(() => {
        // Không cần làm gì vì CSS sẽ tự ẩn khi không hover
      }, 50);
    };

    // Add event listeners
    container.addEventListener("click", handleReactionClick);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("click", handleReactionClick);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleReactionSelect = async (reaction) => {
    let newReaction = null;
    let newCount = count;

    if (selectedReaction === reaction.type) {
      newReaction = null;
      newCount = Math.max(0, count - 1);
    } else {
      const wasSelected = selectedReaction !== null;
      newReaction = reaction.type;
      newCount = wasSelected ? count : count + 1;
    }
    let data = {
      comment_id: comment._id,
      reaction_type: newReaction,
    };
    const response = await submitReaction(data);
    if (response.status === 401) {
      router.pushWithQuery("/dang-nhap", { redirect: pathname });
      notify.changeNotify("error", response.message);
    } else if (response.status === 200) {
      notify.changeNotify("success", response.message);
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    console.log(socketRef.current && comment._id && type && id);
    if (socketRef.current && comment._id && type && id) {
      const newData = {
        reaction: response.data,
        module: type,
        module_id: id,
      };
      socketRef.current.sendEncode({
        type: "comment-reaction",
        data: newData,
      });
    }
  };

  const getCurrentReaction = () => {
    return reactions.find((r) => r.type === selectedReaction);
  };

  const currentReactionData = getCurrentReaction();

  return (
    <div className="reaction-container" ref={containerRef}>
      {/* Floating reactions panel - controlled by CSS hover + JS auto-hide */}
      <div className="reactions-panel" ref={panelRef}>
        {reactions.map((reaction, index) => (
          <button
            key={reaction.type}
            onClick={() => handleReactionSelect(reaction)}
            className={`reaction-icon ${
              selectedReaction === reaction.type ? "selected" : ""
            }`}
            data-type={reaction.type}
            title={reaction.name}
          >
            <span className="reaction-emoji">
              <reaction.icon />
            </span>

            {/* Enhanced tooltip */}
            <div className="reaction-tooltip">{reaction.name}</div>
          </button>
        ))}
      </div>

      {/* Main reaction button */}
      <button
        onClick={() =>
          selectedReaction
            ? handleReactionSelect(getCurrentReaction())
            : handleReactionSelect(reactions[0])
        }
        disabled={!comment._id}
        className={`reaction-button ${selectedReaction ? "selected" : ""} ${
          isAnimating ? "animating" : ""
        }`}
        style={{
          background: selectedReaction
            ? `linear-gradient(135deg, ${currentReactionData?.color}20, ${currentReactionData?.color}40)`
            : undefined,
          borderColor: selectedReaction
            ? currentReactionData?.color
            : undefined,
        }}
      >
        {/* Content wrapper */}
        <div className="button-content">
          {currentReactionData ? (
            <>
              <span
                className="reaction-current-icon"
                style={{ color: currentReactionData.color }}
              >
                <currentReactionData.icon className="w-5 h-5 rounded-full" />
              </span>
              <span
                className="button-text"
                style={{ color: currentReactionData.color }}
              >
                {currentReactionData.name}
              </span>
            </>
          ) : (
            <>
              <LikeIcon className="like-icon" />
              <span className="button-text">Thích</span>
            </>
          )}

          {count > 0 && (
            <span
              className={`reaction-count ${
                selectedReaction ? "selected" : "default"
              }`}
              style={{
                color: selectedReaction
                  ? currentReactionData?.color
                  : undefined,
                boxShadow: selectedReaction
                  ? `-1px -1px 4px 0.5px ${currentReactionData?.color}`
                  : undefined,
              }}
            >
              {count}
            </span>
          )}
        </div>
      </button>
    </div>
  );
};

export default memo(ReactionButton);
