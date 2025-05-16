"use client";

import React, { useEffect, useRef, memo, useContext, useState, useLayoutEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";

import dynamic from "next/dynamic";
import TypingEffect from "./TypeEffect";
import { RosoContext } from "@/context/cms/RosoProvider";
import { useChatStore } from "@/stories/roso/ChatStore";
import { useUIStore } from "@/stories/roso/uiStore";

// Component DownloadTools của bạn
const DownloadTools = dynamic(() => import("@/components/DownloadTools"), {
  ssr: false,
});

const MessageItem = memo(function MessageItem({ message }) {
  const { submitFormQuestion } = useContext(RosoContext);
  const setMessages = useChatStore.getState().setMessages;
  const messages = useChatStore((s) => s.messages);

  const containerRef = useRef(null);
  const printRef = useRef(null);

  // Hàm tạo header bar với 3 nút điều khiển và tên language
  const addHeaderBar = (preElement, block) => {
    // Nếu đã tạo header rồi thì tránh tạo lại
    if (preElement.querySelector(".code-header-bar")) return;

    // Tạo header bar container
    const headerBar = document.createElement("div");
    headerBar.className = "code-header-bar";
    Object.assign(headerBar.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: "4px 8px",
      fontSize: "12px",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      borderBottom: "1px solid #ddd",
    });

    // Lấy tên language từ class "language-xxx"
    const languageMatch = block.className.match(/language-([\w-]+)/);
    const language = languageMatch ? languageMatch[1].toUpperCase() : "CODE";
    const langLabel = document.createElement("span");
    langLabel.textContent = language;
    langLabel.style.fontWeight = "bold";

    // Container cho các nút ở bên phải
    const buttonContainer = document.createElement("div");

    // Nút Expand/Collapse
    const expandButton = document.createElement("button");
    expandButton.textContent = "Collapse";
    expandButton.style.marginRight = "4px";
    Object.assign(expandButton.style, {
      backgroundColor: "#e91e63",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "2px 6px",
      cursor: "pointer",
      fontSize: "12px",
    });
    let isCollapsed = false;
    expandButton.addEventListener("click", () => {
      isCollapsed = !isCollapsed;
      expandButton.textContent = isCollapsed ? "Expand" : "Collapse";
      if (isCollapsed) {
        preElement.style.maxHeight = "50px";
        preElement.style.overflow = "hidden";
      } else {
        preElement.style.maxHeight = "";
        preElement.style.overflow = "";
      }
    });

    // Nút Wrap/Unwrap
    const wrapButton = document.createElement("button");
    wrapButton.textContent = "Wrap";
    wrapButton.style.marginRight = "4px";
    Object.assign(wrapButton.style, {
      backgroundColor: "#009688",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "2px 6px",
      cursor: "pointer",
      fontSize: "12px",
    });
    let isWrapped = false; // Mặc định: không wrap
    wrapButton.addEventListener("click", () => {
      isWrapped = !isWrapped;
      wrapButton.textContent = isWrapped ? "Unwrap" : "Wrap";
      if (isWrapped) {
        preElement.style.whiteSpace = "pre-wrap"; // hiển thị xuống dòng
        preElement.style.wordBreak = "break-all";
      } else {
        preElement.style.whiteSpace = "pre"; // giữ in one-line, với scrollbar nếu dài
        preElement.style.wordBreak = "normal";
      }
    });

    // Nút Copy
    const copyButton = document.createElement("button");
    copyButton.textContent = "Copy";
    Object.assign(copyButton.style, {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "2px 6px",
      cursor: "pointer",
      fontSize: "12px",
    });
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(block.innerText).then(() => {
        copyButton.textContent = "Copied!";
        setTimeout(() => (copyButton.textContent = "Copy"), 2000);
      });
    });

    // Ghép các nút vào container nút
    buttonContainer.appendChild(expandButton);
    buttonContainer.appendChild(wrapButton);
    buttonContainer.appendChild(copyButton);

    // Ghép header bar: bên trái là label, bên phải là nút
    headerBar.appendChild(langLabel);
    headerBar.appendChild(buttonContainer);

    // Chèn header bar vào pre element, ở trên cùng
    // Lưu ý: Nếu <pre> đã có con (trong đó có code), chèn header bar làm con đầu tiên.
    preElement.insertBefore(headerBar, preElement.firstChild);
  };

  // Xử lý highlight code, và chèn header bar
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        // Xử lý download của ảnh (giữ nguyên logic cũ)
        containerRef.current
          .querySelectorAll(".preview-img img")
          .forEach((block) => {
            const preElement = block.parentElement;
            if (!preElement) return;
            if (!preElement.querySelector(".btn-download")) {
              const downloadButton = document.createElement("button");
              downloadButton.innerText = "Download";
              downloadButton.className = "btn-download";
              Object.assign(downloadButton.style, {
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
              downloadButton.addEventListener("click", async () => {
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
              preElement.style.position = "relative";
              preElement.appendChild(downloadButton);
            }
          });

        // Xử lý code block
        containerRef.current.querySelectorAll("pre code").forEach((block) => {
          const lang = block.className || "";
          if (lang.includes("language-markdown")) return; // Bỏ qua markdown
          if (lang.includes("language-")) {
            // Highlight code
            hljs.highlightElement(block);
            // Lấy element <pre> chứa code
            const preElement = block.parentElement;
            if (preElement) {
              // Thêm header bar chứa tên language và các nút
              addHeaderBar(preElement, block);
            }
          }
        });
      }, 300);
    }
  }, [message]);

  // Chuyển markdown => HTML
  let htmlContent = message?.content;
  if (message && !message.isQuestion && message.content) {
    htmlContent = marked(message.content);
  }

  return (
    <div
      className={
        message?.isQuestion
          ? "lg:max-w-[70%] ml-auto bg-light p-4 rounded-lg text-black"
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
            style={{
              maxWidth: "100%",
              overflowX: "auto",
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
        {!message.isQuestion && (
          <div className="flex gap-2 mt-2">
            <button className="text-red-500 hover:text-red-600 transition-all">Chỉnh sửa</button>
            <button
              className="text-red-500 hover:text-red-600 transition-all"
              onClick={async () => {
                const newMessages = messages.filter((data) => data !== message);
                setMessages(newMessages);
                await submitFormQuestion(message.form, false, true);
              }}
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
      {!message?.isQuestion && (
        <DownloadTools rawMarkdown={message.content} printTargetRef={printRef} />
      )}
    </div>
  );
});


const Message = () => {
  const { messageRef, tempRef, tempTextRef, backToBotRef } =
    useContext(RosoContext);
  const messages = useChatStore((s) => s.messages);
  const editorHeight = useUIStore((s) => s.editorHeight);
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
        minHeight: `calc(100vh - ${editorHeight}px)`,
        maxHeight: `calc(100vh - ${editorHeight}px)`,
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
