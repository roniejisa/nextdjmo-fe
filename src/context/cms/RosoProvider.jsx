"use client";
import { getToken } from "@/utils/server/utils";
import { marked } from "marked";
import { createContext, useRef, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import DOMPurify from "dompurify";
import { useChatStore } from "@/stories/roso/ChatStore";
import { httpClientSSE } from "@/utils/client/http";
import ImageCustom from "@/components/Maintain/Image";

export const RosoContext = createContext();
const RosoProvider = ({ children }) => {
  const chatStore = useChatStore.getState();
  const setIsStreaming = chatStore.setIsStreaming;
  const setFormValue = chatStore.setFormValue;
  const addMessage = chatStore.addMessage;

  // **THÊM MỚI: State cho modal preview ảnh**
  const { previewImage, setPreviewImage } = useChatStore();

  const abortControllerRef = useRef(null);
  const messageRef = useRef(null);
  const waitingRef = useRef(false);
  const tempTextRef = useRef(null);
  const editorRef = useRef(null); // Ref to focus back after sending
  const tempRef = useRef(null);
  const backToBotRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup khi component unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  // Thêm vào RosoProvider, ngay sau submitFormQuestion
  const stopStream = () => {
    // console.log("Stopping stream...");

    // Abort request thực sự
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (waitingRef.current) {
      waitingRef.current = false;
      setIsStreaming(false);

      // Chỉ thêm message nếu có nội dung hợp lệ
      if (
        tempTextRef.current &&
        tempTextRef.current.content &&
        tempTextRef.current.content.trim().length > 0
      ) {
        const stoppedMessage = {
          ...tempTextRef.current,
          isStopped: true,
        };
        useChatStore.getState().addMessage(stoppedMessage);
      }

      // Clear temp content
      if (tempRef.current) {
        tempRef.current.innerHTML = "";
      }

      // Reset temp text
      tempTextRef.current = null;
    }
  };

  const submitFormQuestion = async (
    form,
    isRefresh = false,
    isAgain = false
  ) => {
    if (waitingRef.current) {
      waitingRef.current = false;
      setIsStreaming(false);
    }

    const token = await getToken();
    let data = "";
    if (isAgain) {
      data = form.get("message");
    } else {
      data = editorRef.current.getData();
      if (data.length === 0) return;
      addMessage({
        content: data,
        isQuestion: true,
      });
    }

    waitingRef.current = true;
    setIsStreaming(true);

    form.append("model", document.getElementById("model").value);
    editorRef.current.clearData();
    editorRef.current.focus();
    setFormValue(Object.fromEntries(form));

    // ✅ Khởi tạo message object và state
    let accumulatedMessage = {
      content: "",
      isQuestion: false,
      form,
      images: [],
      isGeneratingImage: false,
    };

    tempTextRef.current = accumulatedMessage;

    let currentRawText = "";
    let textQueue = [];
    let isTyping = false;

    // ✅ Hiển thị loading state ban đầu
    const showLoadingState = () => {
      if (!tempRef.current) return;
      tempRef.current.innerHTML = `
    <div class="loading-container" style="padding: 16px; display: flex; align-items: center; gap: 8px; color: #666;">
      <div class="spinner" style="
        width: 16px; 
        height: 16px; 
        border: 2px solid #e0e0e0;
        border-top: 2px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <span>Đang suy luận...</span>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
    };

    // ✅ Hiển thị trạng thái tạo ảnh
    const showImageGenerating = () => {
      return `
    <div class="image-generating" style="
      padding: 12px 16px;
      margin: 8px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    ">
      <div class="image-spinner" style="
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <span style="font-weight: 500;">🎨 Đang tạo hình ảnh...</span>
    </div>
  `;
    };

    // ✅ Render ảnh đẹp với error handling
    const renderImage = (imageUrl, index) => {
      // console.log("Rendering image:", imageUrl, "Index:", index);
      return `
    <div class="image-container" style="
      margin: 16px 0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      background: #f8f9fa;
      position: relative;
    ">
      <img 
        src="${imageUrl}" 
        alt="Generated image ${index + 1}"
        style="
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
          opacity: 1;
        "
        onload="console.log('Image loaded successfully:', '${imageUrl}'); this.style.opacity='1';"
        onerror="console.error('Image load error:', '${imageUrl}'); this.parentElement.innerHTML='<div style=\\"padding: 20px; text-align: center; color: #666;\\"><span style=\\"font-size: 48px;\\">🖼️</span><br><span>Không thể tải hình ảnh: ${imageUrl}</span></div>';"
        onmouseover="this.style.transform='scale(1.02)'"
        onmouseout="this.style.transform='scale(1)'"
      />
      <div class="image-overlay" style="
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: white;
        padding: 16px;
        font-size: 14px;
      ">
        <span>🎨 Hình ảnh được tạo bởi AI</span>
      </div>
    </div>
  `;
    };

    // ✅ Render toàn bộ content - ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT
    const renderCurrentContent = () => {
      if (!tempRef.current) {
        console.error("tempRef.current is null");
        return;
      }

      let fullContent = "";

      // Render text content với typing effect
      if (currentRawText.trim()) {
        // Kiểm tra xem có DOMPurify và marked không
        let processedText = currentRawText;

        try {
          if (
            typeof marked !== "undefined" &&
            typeof DOMPurify !== "undefined"
          ) {
            processedText = DOMPurify.sanitize(marked.parse(currentRawText));
          } else if (typeof marked !== "undefined") {
            processedText = marked.parse(currentRawText);
          } else {
            // Fallback: chuyển đổi markdown cơ bản
            processedText = currentRawText
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              .replace(/\n/g, "<br>");
          }
        } catch (error) {
          console.error("Error processing markdown:", error);
          processedText = currentRawText.replace(/\n/g, "<br>");
        }

        fullContent += `<div class="text-content">${processedText}</div>`;
      }

      // Hiển thị trạng thái tạo ảnh nếu đang tạo
      if (accumulatedMessage.isGeneratingImage) {
        fullContent += showImageGenerating();
        // console.log("Showing image generating state");
      }

      // Render images đã hoàn thành
      if (accumulatedMessage.images && accumulatedMessage.images.length > 0) {
        console.log("Rendering images:", accumulatedMessage.images);
        accumulatedMessage.images.forEach((img, index) => {
          fullContent += renderImage(img, index);
        });
      } else {
        console.log("No images to render");
      }

      // Cập nhật DOM
      // console.log("Setting innerHTML with content length:", fullContent.length);
      tempRef.current.innerHTML = fullContent;

      // Debug: in ra nội dung HTML
      if (accumulatedMessage.images && accumulatedMessage.images.length > 0) {
        // console.log("Final HTML content:", fullContent);
      }

      // Highlight code blocks nếu có hljs
      try {
        if (typeof hljs !== "undefined") {
          tempRef.current.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
          });
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
      }
    };

    const handleStreamChunk = (parsedData) => {
      // console.log("Received chunk:", parsedData);

      // Scroll đến vị trí tempTextRef
      if (typeof window !== "undefined" && tempTextRef.current) {
        try {
          // Kiểm tra xem scrollTo có tồn tại không
          if (typeof window.scrollTo === "function") {
            const element = tempRef.current;
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }
        } catch (error) {
          console.error("Scroll error:", error);
        }
      }

      // Xử lý text trước
      if (parsedData?.text) {
        // Thêm text vào content
        accumulatedMessage.content += parsedData.text;

        // Xử lý typing effect
        const unfinished = textQueue.join("");
        currentRawText += unfinished;
        textQueue = Array.from(parsedData.text);

        // Kiểm tra nếu text mention về việc tạo ảnh, bật trạng thái generating
        if (
          parsedData.text.includes("Tôi sẽ tạo một hình ảnh") ||
          parsedData.text.includes("I will generate an image") ||
          parsedData.text.includes("A striking image") ||
          parsedData.text.includes("I will generate a photorealistic image") ||
          parsedData.text.includes("A captivating image") ||
          parsedData.text.includes("A captivating photo")
        ) {
          accumulatedMessage.isGeneratingImage = true;
        }

        if (!isTyping) typeNextChar();
      }

      // Xử lý image - ƯU TIÊN CAO NHẤT
      if (parsedData?.image) {
        // console.log("Processing image:", parsedData.image);

        // Fix URL path: thay thế tất cả backslash thành forward slash
        const fixedImageUrl = parsedData.image
          .replace(/\\\\/g, "/")
          .replace(/\\/g, "/");
        // console.log("Fixed image URL:", fixedImageUrl);

        // Khởi tạo mảng images nếu chưa có
        if (!accumulatedMessage.images) {
          accumulatedMessage.images = [];
        }

        // Thêm image vào mảng
        accumulatedMessage.images.push(fixedImageUrl);

        // Tắt trạng thái generating vì đã có ảnh
        accumulatedMessage.isGeneratingImage = false;

        // Render ngay lập tức để hiển thị ảnh
        renderCurrentContent();

        // console.log("Current images array:", accumulatedMessage.images);
      }

      tempTextRef.current = { ...accumulatedMessage };
    };

    const typeNextChar = () => {
      if (!tempRef.current || !waitingRef.current || textQueue.length === 0) {
        isTyping = false;
        return;
      }

      isTyping = true;
      const char = textQueue.shift();
      currentRawText += char;

      renderCurrentContent();

      setTimeout(typeNextChar, 20);
    };

    const finishStream = () => {
      // Tắt tất cả loading states
      accumulatedMessage.isGeneratingImage = false;

      // ✅ SỬA LỖI: Chỉ lưu text content vào message, KHÔNG thêm HTML
      let finalContent = currentRawText + textQueue.join("");

      const finalMessage = {
        ...accumulatedMessage,
        content: finalContent, // ✅ CHỈ LƯU TEXT CONTENT, KHÔNG CÓ HTML
        // ✅ Images sẽ được render riêng bởi component hiển thị message
      };

      // console.log("Final message content length:", finalContent.length);
      // console.log(
      //   "Final message images count:",
      //   finalMessage.images?.length || 0
      // );

      // Render lần cuối với tempRef (để hiển thị trong quá trình stream)
      renderCurrentContent();

      // ✅ Thêm message vào store với content CHỈ chứa text
      useChatStore.getState().addMessage(finalMessage);
      setIsStreaming(false);
      waitingRef.current = false;
    };

    // try {
    abortControllerRef.current = new AbortController();

    // ✅ Hiển thị loading ngay từ đầu
    showLoadingState();

    const response = await httpClientSSE(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "generation",
      {
        Authorization: `Bearer ${token}`,
      },
      form,
      "POST",
      true,
      abortControllerRef.current.signal
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.data.getReader();
    const decoder = new TextDecoder();
    let sseBuffer = "";

    function readChunk() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done || !waitingRef.current) {
            finishStream();
            return;
          }

          sseBuffer += decoder.decode(value);
          let events = sseBuffer.split("\n\n");
          sseBuffer = events.pop();

          events.forEach((event) => {
            const lines = event
              .split("\n")
              .filter((line) => line.startsWith("data: "));

            lines.forEach((line) => {
              const jsonStr = line.substring("data: ".length).trim();
              if (jsonStr === "[DONE]") return;

              try {
                const parsedData = JSON.parse(jsonStr);
                handleStreamChunk(parsedData);
              } catch (err) {
                console.error("JSON parse error:", err, "Line:", jsonStr);
              }
            });
          });

          readChunk();

          // Kiểm tra scroll function
          if (typeof checkScroll === "function") {
            checkScroll();
          }
        })
        .catch((error) => {
          // Kiểm tra nếu là abort error thì không log
          if (error.name === "AbortError") {
            // console.log("Stream was aborted");
            return;
          }
          console.error("Stream reading error:", error);
          finishStream();
        });
    }

    readChunk();
    // } catch (error) {
    //   console.error("Request error:", error);
    //   if (tempRef.current) {
    //     tempRef.current.innerHTML = `
    //   <div style="padding: 16px; color: #e74c3c; background: #fdf2f2; border-radius: 8px; border-left: 4px solid #e74c3c;">
    //     <strong>❌ Lỗi kết nối</strong><br>
    //     Không thể kết nối đến server. Vui lòng thử lại sau.
    //   </div>
    // `;
    //   }
    //   setIsStreaming(false);
    //   waitingRef.current = false;
    // }
  };

  const checkScroll = () => {
    if (!messageRef.current || !backToBotRef.current) return;
    const scrollTop = messageRef.current.scrollTop;
    const windowHeight = messageRef.current.offsetHeight;
    const fullHeight = messageRef.current.scrollHeight;

    const distanceFromBottom = fullHeight - (scrollTop + windowHeight);

    if (distanceFromBottom > 100) {
      backToBotRef.current.classList.remove("opacity-0");
      backToBotRef.current.classList.add("opacity-100");
    } else {
      backToBotRef.current.classList.remove("opacity-100");
      backToBotRef.current.classList.add("opacity-0");
    }
  };

  // **THÊM MỚI: Hàm đóng modal preview**
  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  // **THÊM MỚI: Hàm mở modal preview**
  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.addEventListener("scroll", checkScroll);
      checkScroll(); // gọi 1 lần để set đúng trạng thái ban đầu
    }

    return () => {
      if (messageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        messageRef?.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);
  console.log(previewImage);
  return (
    <RosoContext.Provider
      value={{
        waitingRef,
        messageRef,
        tempTextRef,
        editorRef,
        tempRef,
        backToBotRef,
        submitFormQuestion,
        stopStream,
        abortControllerRef,
        handleClosePreview,
        handlePreviewImage,
      }}
    >
      {children}
      {/* **THÊM MỚI: Modal Preview ảnh** */}

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClosePreview}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {/* Nút đóng */}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200"
              title="Đóng"
            >
              <svg
                className="w-6 h-6"
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
            </button>

            {/* Ảnh preview */}
            <ImageCustom
              width={0}
              height={0}
              src={previewImage}
              alt="Preview"
              className="max-w-full min-h-[calc(100vh/2)] max-h-[90vh] w-fit object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </RosoContext.Provider>
  );
};

export default RosoProvider;
