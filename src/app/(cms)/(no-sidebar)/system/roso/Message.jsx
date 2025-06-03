/* eslint-disable react/display-name */
"use client";

import React, {
  useEffect,
  useRef,
  memo,
  useContext,
  useState,
  useLayoutEffect,
} from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import dynamic from "next/dynamic";
import { RosoContext } from "@/context/cms/RosoProvider";
import { useChatStore } from "@/stories/roso/ChatStore";
import { useUIStore } from "@/stories/roso/uiStore";
import TypingEffect from "./TypeEffect";
import ImageCustom from "@/components/Maintain/Image";

// Dynamic imports
const DownloadTools = dynamic(() => import("@/components/DownloadTools"), {
  ssr: false,
});

// Custom hooks for logic separation
const useCodeBlockLogic = () => {
  const addHeaderBar = (preElement, block) => {
    if (preElement.querySelector(".code-header-bar")) return;

    const headerBar = document.createElement("div");
    headerBar.className = "code-header-bar";

    // Modern glassmorphism header styling
    Object.assign(headerBar.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
      backdropFilter: "blur(10px)",
      borderRadius: "12px 12px 0 0",
      padding: "12px 16px",
      fontSize: "12px",
      fontWeight: "600",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    });

    // Language label with modern styling
    const languageMatch = block.className.match(/language-([\w-]+)/);
    const language = languageMatch ? languageMatch[1].toUpperCase() : "CODE";
    const langLabel = document.createElement("span");
    langLabel.textContent = language;
    Object.assign(langLabel.style, {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: "700",
      fontSize: "13px",
      letterSpacing: "0.5px",
    });

    // Button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "8px";

    // Create modern 3D buttons
    const createModernButton = (text, bgGradient, onClick) => {
      const button = document.createElement("button");
      button.textContent = text;
      Object.assign(button.style, {
        background: bgGradient,
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: "600",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transform: "translateY(0)",
      });

      // Hover effects
      button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-2px)";
        button.style.boxShadow =
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(0)";
        button.style.boxShadow =
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
      });

      button.addEventListener("click", onClick);
      return button;
    };

    // Expand/Collapse button
    let isCollapsed = false;
    const expandButton = createModernButton(
      "Collapse",
      "linear-gradient(135deg, #ff6b6b, #ee5a52)",
      () => {
        isCollapsed = !isCollapsed;
        expandButton.textContent = isCollapsed ? "Expand" : "Collapse";
        if (isCollapsed) {
          preElement.style.maxHeight = "60px";
          preElement.style.overflow = "hidden";
        } else {
          preElement.style.maxHeight = "";
          preElement.style.overflow = "";
        }
      }
    );

    // Wrap/Unwrap button
    let isWrapped = false;
    const wrapButton = createModernButton(
      "Wrap",
      "linear-gradient(135deg, #4ecdc4, #44a08d)",
      () => {
        isWrapped = !isWrapped;
        wrapButton.textContent = isWrapped ? "Unwrap" : "Wrap";
        if (isWrapped) {
          preElement.style.whiteSpace = "pre-wrap";
          preElement.style.wordBreak = "break-all";
        } else {
          preElement.style.whiteSpace = "pre";
          preElement.style.wordBreak = "normal";
        }
      }
    );

    // Copy button
    const copyButton = createModernButton(
      "Copy",
      "linear-gradient(135deg, #667eea, #764ba2)",
      () => {
        navigator.clipboard.writeText(block.innerText).then(() => {
          copyButton.textContent = "Copied!";
          copyButton.style.background =
            "linear-gradient(135deg, #51d7b1, #a4e8d7)";
          setTimeout(() => {
            copyButton.textContent = "Copy";
            copyButton.style.background =
              "linear-gradient(135deg, #667eea, #764ba2)";
          }, 2000);
        });
      }
    );

    buttonContainer.appendChild(expandButton);
    buttonContainer.appendChild(wrapButton);
    buttonContainer.appendChild(copyButton);

    headerBar.appendChild(langLabel);
    headerBar.appendChild(buttonContainer);

    preElement.insertBefore(headerBar, preElement.firstChild);
  };

  return { addHeaderBar };
};

const useImageDownloadLogic = () => {
  const addDownloadButton = (block) => {
    const preElement = block.parentElement;
    if (!preElement || preElement.querySelector(".btn-download")) return;

    const downloadButton = document.createElement("button");
    downloadButton.innerText = "Download";
    downloadButton.className = "btn-download";
    Object.assign(downloadButton.style, {
      position: "absolute",
      top: "12px",
      right: "12px",
      padding: "8px 16px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateY(0)",
    });

    downloadButton.addEventListener("mouseenter", () => {
      downloadButton.style.transform = "translateY(-2px)";
      downloadButton.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
    });

    downloadButton.addEventListener("mouseleave", () => {
      downloadButton.style.transform = "translateY(0)";
      downloadButton.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
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
  };

  return { addDownloadButton };
};

// Modern Edit Textarea Component
const EditableTextArea = memo(({ value, onSave, onCancel, className }) => {
  const [editValue, setEditValue] = useState(value);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Auto resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  const handleSave = () => {
    if (editValue.trim() !== value.trim()) {
      onSave(editValue.trim());
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
    }
  };

  const handleInput = (e) => {
    setEditValue(e.target.value);
    // Auto resize
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  return (
    <div className={`${className} space-y-3`}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full p-4 bg-white/90 backdrop-blur-sm border-2 border-blue-200 
                     rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 
                     transition-all duration-300 resize-none font-medium text-gray-800
                     placeholder-gray-400 shadow-lg hover:shadow-xl
                     min-h-[120px] max-h-[400px] overflow-y-auto
                     scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
          placeholder="Nhập nội dung của bạn..."
          style={{
            lineHeight: "1.6",
            fontSize: "15px",
          }}
        />
        <div
          className="absolute -top-6 right-3 text-xs text-gray-400 bg-white/80 
                        px-2 py-1 rounded-md backdrop-blur-sm"
        >
          Ctrl/⌘ + Enter để lưu, Esc để hủy
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 
                     hover:text-gray-800 bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm 
                     rounded-lg border border-gray-200 hover:border-gray-300 
                     transition-all duration-200 hover:scale-105 hover:shadow-md
                     active:scale-95"
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
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Hủy
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white 
                     bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                     rounded-lg shadow-lg hover:shadow-xl border border-blue-300/50
                     transition-all duration-200 hover:scale-105 active:scale-95
                     backdrop-blur-sm"
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
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
});

// Action buttons component
const ActionButtons = memo(({ message, onEdit, onRetry, noEdit = false }) => (
  <div className="flex items-center gap-3 mt-4 transition-all duration-300">
    {!noEdit && (
      <button
        onClick={() => onEdit(message)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 
                 bg-white/50 hover:bg-blue-50/80 backdrop-blur-sm rounded-lg border border-gray-200/50 
                 hover:border-blue-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Chỉnh sửa
      </button>
    )}
    <button
      onClick={() => onRetry(message)}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-green-600 
                 bg-white/50 hover:bg-green-50/80 backdrop-blur-sm rounded-lg border border-gray-200/50 
                 hover:border-green-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Thử lại
    </button>
  </div>
));

// Main message item component
const MessageItem = memo(function MessageItem({ message, index }) {
  const { submitFormQuestion } = useContext(RosoContext);
  const setMessages = useChatStore.getState().setMessages;
  const messages = useChatStore((s) => s.messages);
  const containerRef = useRef(null);
  const printRef = useRef(null);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);

  const { addHeaderBar } = useCodeBlockLogic();
  const { addDownloadButton } = useImageDownloadLogic();

  const handleEdit = () => {
    if (message?.isQuestion) {
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async (newContent) => {
    console.log(newContent && newContent !== message.content);
    if (newContent && newContent !== message.content) {
      // Cập nhật message với nội dung mới
      const updatedMessages = messages.map((msg) =>
        msg === message ? { ...msg, content: newContent } : msg
      );
      setMessages(updatedMessages);

      // Xóa các phản hồi sau message này để tạo lại
      const messageIndex = messages.indexOf(message);
      const filteredMessages = updatedMessages.slice(0, messageIndex + 1);
      setMessages(filteredMessages);

      // Gửi lại form với nội dung mới
      const updatedForm = new FormData();
      Object.entries({ ...message, message: newContent }).forEach(
        ([key, value]) => {
          updatedForm.append(key, value);
        }
      );
      setIsEditing(false);
      // Thêm các field khác
      await submitFormQuestion(updatedForm, false, true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleRetry = async () => {
    let messageResponse = message;
    let messageData = message;
    if (message?.isQuestion && messages[index + 1]) {
      messageResponse = messages[index + 1];
    } else {
      messageData = messages[index - 1];
    }
    const newMessages = messages.filter((data) => data !== messageResponse);
    setMessages(newMessages);
    refreshMessage(messageData);
  };

  const refreshMessage = async (messageData) => {
    const updatedForm = new FormData();
    Object.entries({ messageData, message: messageData.content }).forEach(
      ([key, value]) => {
        if (["message", "image"].includes(key)) updatedForm.append(key, value);
      }
    );
    await submitFormQuestion(updatedForm, false, true);
  };

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        // Handle image downloads
        containerRef.current
          .querySelectorAll(".preview-img img")
          .forEach(addDownloadButton);

        // Handle code blocks
        containerRef.current.querySelectorAll("pre code").forEach((block) => {
          const lang = block.className || "";
          if (lang.includes("language-markdown")) return;
          if (lang.includes("language-")) {
            hljs.highlightElement(block);
            const preElement = block.parentElement;
            if (preElement) {
              // Add modern styling to pre element
              Object.assign(preElement.style, {
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              });
              addHeaderBar(preElement, block);
            }
          }
        });
      }, 300);
    }
  }, [message, addHeaderBar, addDownloadButton]);

  let htmlContent = message?.content;
  if (message && !message.isQuestion && message.content) {
    htmlContent = marked(message.content);
  }

  const messageClasses = message?.isQuestion
    ? `group max-w-[85%] lg:max-w-[70%] ml-auto relative`
    : `group max-w-full relative`;

  const contentClasses = message?.isQuestion
    ? `bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl 
       shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20
       transform hover:scale-[1.02] hover:-translate-y-1 text-white font-bold`
    : `bg-gradient-to-br from-white/80 via-gray-50/80 to-white/60 backdrop-blur-xl p-4 lg:p-6 rounded-2xl lg:rounded-3xl 
       shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50
       transform hover:scale-[1.01] hover:-translate-y-0.5`;
  if (message.isStopped) {
    return (
      <div className="message-item stopped">
        <div className="message-content">
          {message.content}
          <div className="stopped-indicator">⚠️ Phản hồi đã bị dừng</div>
        </div>
      </div>
    );
  }

  return (
    <div className={messageClasses}>
      <div className="w-fit max-w-full space-y-4">
        {htmlContent && htmlContent.trim() && (
          <div ref={printRef}>
            {isEditing ? (
              <EditableTextArea
                value={message.content}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                className="w-full"
              />
            ) : (
              <div className={contentClasses}>
                <div
                  ref={containerRef}
                  className={`markdown-content prose prose-sm lg:prose-base max-w-none
                            ${
                              message.isQuestion
                                ? "whitespace-pre-line prose-invert"
                                : "prose-gray"
                            }`}
                  style={{
                    maxWidth: "100%",
                    overflowX: "auto",
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            )}
          </div>
        )}
        {message.images && message.images.length > 0 && (
          <div>
            (
            <div
              className="bg-gradient-to-br w-fit from-white/80 via-gray-50/80 to-white/60 backdrop-blur-xl rounded-2xl lg:rounded-3xl 
       shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50
       transform hover:scale-[1.01] hover:-translate-y-0.5"
            >
              {message.images.map((imageUrl, index) => (
                <div key={index} className="image-container">
                  <ImageCustom
                    className={"max-w-full h-auto min-w-96 rounded-2xl"}
                    width={0}
                    height={0}
                    src={imageUrl}
                    alt={`Generated image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            )
          </div>
        )}

        {!isEditing && message?.isQuestion && (
          <ActionButtons
            message={message}
            onEdit={handleEdit}
            onRetry={handleRetry}
          />
        )}

        {!message.isQuestion && (
          <ActionButtons
            noEdit={true}
            message={message}
            onEdit={handleEdit}
            onRetry={handleRetry}
          />
        )}
      </div>

      {!message?.isQuestion &&
        message.content &&
        message.images.length == 0 && (
          <div className="mt-4">
            <DownloadTools
              rawMarkdown={message.content}
              printTargetRef={printRef}
            />
          </div>
        )}
    </div>
  );
});

// Scroll to bottom button component
const ScrollToBottomButton = memo(({ backToBotRef, messageRef }) => (
  <button
    ref={backToBotRef}
    onClick={() => {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }}
    className="group cursor-pointer opacity-0 transition-all duration-500 sticky z-20 
               left-1/2 -translate-x-1/2 bottom-6 w-12 h-12 lg:w-14 lg:h-14
               bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
               rounded-full shadow-lg hover:shadow-xl border-2 border-white/20
               flex items-center justify-center backdrop-blur-sm
               transform hover:scale-110 hover:-translate-y-1 active:scale-95"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white transition-transform duration-200 group-hover:translate-y-0.5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21C11.7348 21 11.4804 20.8946 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.5196 20.8946 12.2652 21 12 21Z"
        fill="currentColor"
      />
    </svg>
  </button>
));

// Main Message component
const Message = () => {
  const { messageRef, tempRef, tempTextRef, backToBotRef } =
    useContext(RosoContext);
  const messages = useChatStore((s) => s.messages);
  const editorHeight = useUIStore((s) => s.editorHeight);
  const pageRef = useRef(1);
  const observerRef = useRef(null);
  const isLoadingMore = useRef(false);
  console.log(editorHeight);
  useLayoutEffect(() => {
    tempTextRef.current = null;
    tempRef.current.innerHTML = "";
  }, [messages, tempTextRef, tempRef]);

  useEffect(() => {
    const container = messageRef.current;
    if (!container) return;

    const target = container.firstElementChild;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoadingMore.current) {
            isLoadingMore.current = true;
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
  }, [messageRef]);

  return (
    <div
      className="overflow-auto bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 
                 backdrop-blur-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 
                 hover:scrollbar-thumb-gray-400"
      style={{
        minHeight: `calc(100vh - ${editorHeight}px)`,
        maxHeight: `calc(100vh - ${editorHeight}px)`,
      }}
      ref={messageRef}
    >
      <div className="flex flex-col gap-4 lg:gap-6 max-w-4xl mx-auto text-sm lg:text-base pt-6 px-4 lg:px-6">
        {/* Intersection observer trigger */}
        <div style={{ height: "1px" }} className="invisible"></div>

        {messages
          .filter((item) => {
            // Bỏ qua message rỗng
            if (!item.content || item.content.trim().length === 0) return false;

            // Bỏ qua message chỉ có HTML rỗng
            const textContent = item.content.replace(/<[^>]*>/g, "").trim();
            return textContent.length > 0;
          })
          .map((item, index) => (
            <MessageItem key={index} index={index} message={item} />
          ))}

        <TypingEffect />

        <ScrollToBottomButton
          backToBotRef={backToBotRef}
          messageRef={messageRef}
        />
      </div>
    </div>
  );
};

export default Message;
