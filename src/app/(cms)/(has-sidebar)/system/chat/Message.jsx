"use client";

import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SocketContext } from "@/context/SocketProvider";
import { useMessage } from "@/hooks/useMessage";
import { formatTime } from "@/utils/client";
import ImageCustom from "@/components/Maintain/Image";

// Component render 1 tin nhắn
const MessageItem = ({ message, isSamePerson, sessionId }) => {
  return (
    <div
      className={`flex gap-2 ${
        message.customer_id === sessionId ? "justify-end" : "items-start"
      }`}
    >
      {!isSamePerson && message.customer_id !== sessionId ? (
        <div className="w-8 h-8 relative flex-[0_0_32px]">
          <ImageCustom
            fill={true}
            src={message.customer.avatar}
            alt="avatar"
            className="w-full h-full rounded-full"
          />
        </div>
      ) : (
        <div className="flex-[0_0_32px]"></div>
      )}
      <div>
        {!isSamePerson && message.customer_id !== sessionId && (
          <div className="text-xs mb-2">
            {message.customer.first_name} {message.customer.last_name}
          </div>
        )}
        <div className="p-2 bg-outline text-white rounded-md">
          <div>{message.content}</div>
          <span className="text-xs">
            {formatTime(new Date(message.message_at))}
          </span>
        </div>
      </div>
    </div>
  );
};

const Message = () => {
  const { messageRef, messages, editorHeight, setMessages } = useMessage();
  const { addTypes, socketRef, sessionIdRef } = useContext(SocketContext);

  const pageRef = useRef(1);
  const observerRef = useRef(null);
  const isLoadingMore = useRef(false);
  const [isScroll, setIsScroll] = useState(false);

  // --- 1. Lắng nghe tin nhắn mới (send-message) ---
  useEffect(() => {
    addTypes("send-message", (data) => {
      // Append tin nhắn mới vào state
      setMessages((prev) => [...prev, data]);
    });
  }, [addTypes, setMessages]);

  // Sau khi có tin nhắn mới, nếu người dùng đang gần cuối thì tự động cuộn xuống
  useLayoutEffect(() => {
    const container = messageRef.current;
    if (!container) return;
    if (!isScroll) {
      container.scrollTop = container.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // --- 2. Lắng nghe load tin cũ (load-more-message) ---
  useEffect(() => {
    addTypes("load-more-message", (data) => {
      const container = messageRef.current;
      if (!container) return;

      // Lưu lại vị trí scroll trước khi cập nhật state
      const prevScrollTop = container.scrollTop;
      const prevScrollHeight = container.scrollHeight;

      // Giả sử server trả về data là tin nhắn cũ theo thứ tự từ cũ -> mới,
      // nên đảo mảng để hiển thị đúng thứ tự khi prepend
      const olderMessages = [...data].reverse();

      setMessages((prev) => [...olderMessages, ...prev]);

      // Sau khi render xong, điều chỉnh scrollTop để giữ vị trí hiện tại
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
      }, 0);

      // Nếu không còn dữ liệu thì đánh dấu đã load hết
      if (data.length === 0) {
        isLoadingMore.current = true;
      } else {
        isLoadingMore.current = false;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTypes, setMessages]);

  // --- 3. Load tin nhắn đầu tiên ---
  useEffect(() => {
    if (messageRef.current && pageRef.current === 1) {
      socketRef.current.sendEncode({
        type: "load-more-message",
        data: { id: sessionIdRef.current, page: pageRef.current },
      });
      pageRef.current++;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef, sessionIdRef]);

  // --- 4. Sử dụng Intersection Observer để load tin cũ khi cuộn lên đầu ---
  useEffect(() => {
    const container = messageRef.current;
    if (!container) return;

    // Giả sử phần tử trigger là phần tử đầu tiên trong container
    const target = container.firstElementChild;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoadingMore.current) {
            isLoadingMore.current = true;
            socketRef.current.sendEncode({
              type: "load-more-message",
              data: { id: sessionIdRef.current, page: pageRef.current },
            });
            pageRef.current++;
          }
        });
      },
      { root: container, threshold: 0.1 }
    );

    observerRef.current.observe(target);
    return () => {
      observerRef.current && observerRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef, sessionIdRef]);

  return (
    <div>
      <div
        ref={messageRef}
        style={{
          minHeight: `calc(100vh - ${editorHeight}px - 64px)`,
          maxHeight: `calc(100vh - ${editorHeight}px - 64px)`,
        }}
        className="flex flex-col gap-2 text-sm overflow-auto pt-4 px-4"
      >
        {/* Một phần tử nhỏ ở đầu làm trigger cho Observer */}
        <div style={{ height: "1px" }}></div>
        {messages.map((item, index) => {
          const isSamePerson =
            index > 0 && messages[index - 1].customer_id === item.customer_id;
          return (
            <MessageItem
              key={index}
              message={item}
              isSamePerson={isSamePerson}
              sessionId={sessionIdRef.current}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Message;