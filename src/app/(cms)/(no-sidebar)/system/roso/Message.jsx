"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from "react";
import { useMessage } from "@/hooks/useMessage";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import dynamic from "next/dynamic";
import TypingEffect from "./TypeEffect";

const DownloadTools = dynamic(() => import("@/components/DownloadTools"), {
  ssr: false,
});

const MessageItem = memo(function MessageItem({ message }) {
  const { submitFormQuestion, setMessages } = useMessage();
  // Tạo một ref để tham chiếu tới container chứa HTML của message
  const containerRef = useRef(null);
  const printRef = useRef(null);

  // Sử dụng useEffect để gọi highlight.js sau khi message được render
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current
          .querySelectorAll(".preview-img img")
          .forEach((block) => {
            // Lấy thẻ <pre> chứa code block
            const preElement = block.parentElement;
            preElement.style.position = "relative"; // Đảm bảo vị trí cho nút absolute
            const copyButton = document.createElement("button");
            copyButton.innerText = "Download";
            copyButton.style.position = "absolute";
            copyButton.style.top = "10px";
            copyButton.style.right = "10px";
            copyButton.style.padding = "5px 10px";
            copyButton.style.backgroundColor = "#007bff";
            copyButton.style.color = "#fff";
            copyButton.style.border = "none";
            copyButton.style.borderRadius = "4px";
            copyButton.style.cursor = "pointer";

            // Sự kiện khi nhấn nút copy
            copyButton.addEventListener("click", async () => {
              const url = block.src;
              if (url) {
                try {
                  const response = await fetch(url, { mode: "cors" });
                  const blob = await response.blob();
                  const objectUrl = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = objectUrl;
                  a.download = url.split("/").pop();
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(objectUrl);
                } catch (error) {
                  console.error("Lỗi khi tải file:", error);
                }
              }
            });
            // Thêm nút copy vào pre block
            preElement.appendChild(copyButton);
          });
      }, 300);

      function addCopyButton(block) {
        const preElement = block.parentElement;
        if (!preElement) return;

        // Kiểm tra đã có nút chưa tránh bị lặp
        if (preElement.querySelector(".btn-copy")) return;

        const copyButton = document.createElement("button");
        copyButton.innerText = "Copy";
        copyButton.className = "btn-copy";
        Object.assign(copyButton.style, {
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        });

        copyButton.addEventListener("click", () => {
          navigator.clipboard.writeText(block.innerText).then(() => {
            copyButton.innerText = "Copied!";
            setTimeout(() => (copyButton.innerText = "Copy"), 2000);
          });
        });

        preElement.style.position = "relative";
        preElement.appendChild(copyButton);
      }

      containerRef.current.querySelectorAll("pre code").forEach((block) => {
        const lang = block.className || "";

        if (lang.includes("language-markdown")) return; // 🚫 Bỏ qua markdown

        if (lang.includes("language-")) {
          hljs.highlightElement(block);
          addCopyButton(block);
        }
      });
    }
  }, [message]); // Chạy mỗi khi message thay đổi

  // Chuyển đổi raw markdown thành HTML
  function unwrapMarkdownCodeBlock(text) {
    const match = text.match(/```(?:markdown)?\s*([\s\S]*?)\s*```/i);
    return match ? match[1].trim() : text;
  }
  let htmlContent = message?.content;
  if (message && !message.isQuestion && message.content) {
    // const cleanMarkdown = unwrapMarkdownCodeBlock(message.content);
    htmlContent = marked(message.content);
  }
  console.log(htmlContent);
  return (
    <div
      className={
        message?.isQuestion
          ? "lg:max-w-[70%] ml-auto bg-light p-4 rounded-lg text-white"
          : ""
      }
    >
      <div className="w-fit">
        <div ref={printRef}>
          <div
            ref={containerRef}
            className={`markdown-content ${
              message.isQuestion ? "whitespace-pre-line" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
        {!message.isQuestion && (
          <div className="flex gap-2 mt-2">
            <button>Chỉnh sửa</button>
            <button
              onClick={async () => {
                setMessages((prev) => {
                  // Kiểm tra câu trả lời giống nhau thì xóa
                  return prev.filter((data) => data != message);
                });
                await submitFormQuestion(message.form, false, true);
              }}
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
      {!message?.isQuestion && (
        <DownloadTools
          rawMarkdown={message.content}
          printTargetRef={printRef}
        />
      )}
    </div>
  );
});

const Message = () => {
  const {
    messageRef,
    messages,
    tempRef,
    tempTextRef,
    editorHeight,
    backToBotRef,
  } = useMessage();
  const pageRef = useRef(1);
  const observerRef = useRef(null);
  const isLoadingMore = useRef(false);
  useLayoutEffect(() => {
    tempTextRef.current = null;
    tempRef.current.innerHTML = "";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);
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
            // Loadmore function
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
  }, []);
  return (
    <div
      className="overflow-auto"
      style={{
        minHeight: `calc(100vh - ${editorHeight}px - 48px)`,
        maxHeight: `calc(100vh - ${editorHeight}px - 48px)`,
      }}
      ref={messageRef}
    >
      <div
        className="flex flex-col gap-2 lg:max-w-[70%] m-auto text-sm pt-4 px-4 all-message" //whitespace-pre-line chỉ được dùng khi không dùng marks
      >
        {/* Một phần tử nhỏ ở đầu làm trigger cho Observer */}
        <div style={{ height: "1px" }}></div>
        {messages.map((item, index) => {
          return <MessageItem key={index} message={item} />;
        })}
        <TypingEffect />
        <button
          ref={backToBotRef}
          onClick={() => {
            messageRef.current.scrollTo({
              top: messageRef.current.scrollHeight,
              behavior: "smooth",
            });
          }}
          className="cursor-pointer opacity-0 transition-all duration-300 sticky z-10 rounded-full bg-clip-padding border text-token-text-secondary border-token-border-light left-1/2 -translate-x-1/2 bg-white w-8 h-8 flex items-center justify-center bottom-5"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-md text-token-text-primary"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 21C11.7348 21 11.4804 20.8946 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.5196 20.8946 12.2652 21 12 21Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Message;
