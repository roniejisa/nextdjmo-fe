"use client";
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

  // State cho modal preview ảnh
  const { previewImage, setPreviewImage } = useChatStore();

  // Refs cho quản lý component lifecycle và streaming
  const abortControllerRef = useRef(null);
  const messageRef = useRef(null);
  const waitingRef = useRef(false);
  const tempTextRef = useRef(null);
  const editorRef = useRef(null);
  const tempRef = useRef(null);
  const backToBotRef = useRef(null);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup AbortController để tránh memory leak
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  /**
   * Dừng stream đang chạy và cleanup resources
   * Xử lý việc abort request và lưu message tạm thời nếu có nội dung
   */
  const stopStream = () => {
    console.log("Stopping stream...");

    // Abort request thực sự và cleanup hoàn toàn
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (waitingRef.current) {
      waitingRef.current = false;
      setIsStreaming(false);

      // Chỉ thêm message nếu có nội dung text hợp lệ
      if (
        tempTextRef.current &&
        tempTextRef.current.content &&
        tempTextRef.current.content.trim().length > 0
      ) {
        const stoppedMessage = {
          ...tempTextRef.current,
          isStopped: true, // Đánh dấu message bị dừng giữa chừng
        };
        useChatStore.getState().addMessage(stoppedMessage);
      }

      // Clear temp content DOM
      if (tempRef.current) {
        tempRef.current.innerHTML = "";
      }

      // Reset temp text reference
      tempTextRef.current = null;
    }
  };

  /**
   * Xử lý lỗi khi load ảnh với fallback UI
   * @param {string} imageUrl - URL ảnh bị lỗi
   * @param {HTMLElement} element - Element img bị lỗi
   */
  const handleImageError = (imageUrl, element) => {
    console.error("Image load error:", imageUrl);

    // Tạo fallback UI với option retry
    if (element && element.parentElement) {
      element.parentElement.innerHTML = `
        <div style="
          padding: 20px; 
          text-align: center; 
          color: #666;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #dee2e6;
        ">
          <div style="font-size: 48px; margin-bottom: 12px;">🖼️</div>
          <div style="margin-bottom: 8px;">Không thể tải hình ảnh</div>
          <div style="font-size: 12px; color: #999; word-break: break-all;">
            ${imageUrl}
          </div>
          <button 
            onclick="window.location.reload()" 
            style="
              margin-top: 12px;
              padding: 6px 12px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            Tải lại trang
          </button>
        </div>
      `;
    }
  };

  /**
   * Submit form và xử lý streaming response
   * @param {FormData} form - Form data chứa message và settings
   * @param {boolean} isRefresh - Có phải refresh request không
   * @param {boolean} isAgain - Có phải gửi lại message cũ không
   */
  const submitFormQuestion = async (
    form,
    isRefresh = false,
    isAgain = false
  ) => {
    // Dừng stream hiện tại nếu có
    if (waitingRef.current) {
      waitingRef.current = false;
      setIsStreaming(false);
    }

    let data = "";

    // Xử lý data dựa trên loại request
    if (isAgain) {
      data = form.get("message");
    } else {
      data = editorRef.current.getData();
      if (data.length === 0) return;

      // Thêm message user vào chat
      addMessage({
        content: data,
        isQuestion: true,
      });
    }

    // Thiết lập trạng thái streaming
    waitingRef.current = true;
    setIsStreaming(true);

    // Chuẩn bị form data
    form.append("model", document.getElementById("model").value);
    editorRef.current.clearData();
    editorRef.current.focus();
    setFormValue(Object.fromEntries(form));

    // Khởi tạo message object cho streaming
    let accumulatedMessage = {
      content: "",
      isQuestion: false,
      form,
      images: [],
      isGeneratingImage: false,
    };

    tempTextRef.current = accumulatedMessage;

    // Biến cho typing effect
    let currentRawText = "";
    let textQueue = [];
    let isTyping = false;

    /**
     * Hiển thị loading state với spinner animation
     */
    const showLoadingState = () => {
      if (!tempRef.current) return;
      tempRef.current.innerHTML = `
        <div class="loading-container" style="
          padding: 16px; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          color: #666;
        ">
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

    /**
     * Hiển thị trạng thái đang tạo ảnh
     */
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

    /**
     * Render ảnh với error handling và preview functionality
     * @param {string} imageUrl - URL của ảnh
     * @param {number} index - Index ảnh trong danh sách
     */
    const renderImage = (imageUrl, index) => {
      console.log("Rendering image:", imageUrl, "Index:", index);
      return `
        <div class="image-container" style="
          margin: 16px 0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          background: #f8f9fa;
          position: relative;
          cursor: pointer;
        " onclick="window.rosoPreviewImage?.('${imageUrl}')">
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
            onerror="console.error('Image load error:', '${imageUrl}'); this.parentElement.innerHTML='<div style=\\"padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;\\"><div style=\\"font-size: 48px; margin-bottom: 12px;\\">🖼️</div><div style=\\"margin-bottom: 8px;\\">Không thể tải hình ảnh</div><div style=\\"font-size: 12px; color: #999; word-break: break-all;\\">${imageUrl}</div><button onclick=\\"window.location.reload()\\" style=\\"margin-top: 12px; padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;\\">Tải lại trang</button></div>';"
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
            pointer-events: none;
          ">
            <span>🎨 Hình ảnh được tạo bởi AI</span>
          </div>
        </div>
      `;
    };

    /**
     * Render toàn bộ content hiện tại bao gồm text và images
     */
    const renderCurrentContent = () => {
      if (!tempRef.current) {
        console.error("tempRef.current is null");
        return;
      }

      let fullContent = "";

      // Render text content với markdown processing
      if (currentRawText.trim()) {
        let processedText = currentRawText;

        try {
          // Xử lý markdown với DOMPurify để bảo mật
          if (
            typeof marked !== "undefined" &&
            typeof DOMPurify !== "undefined"
          ) {
            processedText = DOMPurify.sanitize(marked.parse(currentRawText));
          } else if (typeof marked !== "undefined") {
            processedText = marked.parse(currentRawText);
          } else {
            // Fallback: markdown processing cơ bản
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
        console.log("Showing image generating state");
      }

      // Render images đã hoàn thành
      if (accumulatedMessage.images && accumulatedMessage.images.length > 0) {
        console.log("Rendering images:", accumulatedMessage.images);
        accumulatedMessage.images.forEach((img, index) => {
          fullContent += renderImage(img, index);
        });
      }

      // Cập nhật DOM
      tempRef.current.innerHTML = fullContent;

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

    /**
     * Xử lý từng chunk data từ stream
     * @param {Object} parsedData - Data đã parse từ SSE
     */
    const handleStreamChunk = (parsedData) => {
      console.log("Received chunk:", parsedData);

      // Auto scroll để theo dõi nội dung mới
      if (typeof window !== "undefined" && tempTextRef.current) {
        try {
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

      // Xử lý text streaming với typing effect
      if (parsedData?.text) {
        // Accumulate text content cho final message
        accumulatedMessage.content += parsedData.text;

        // Tạo typing effect: split text thành queue để render từng ký tự
        const unfinished = textQueue.join("");
        currentRawText += unfinished;
        textQueue = Array.from(parsedData.text);

        // Detect image generation trigger words
        const imageGenerationTriggers = [
          "Tôi sẽ tạo một hình ảnh",
          "I will generate an image",
          "A striking image",
          "I will generate a photorealistic image",
          "A captivating image",
          "A captivating photo",
        ];

        if (
          imageGenerationTriggers.some((trigger) =>
            parsedData.text.includes(trigger)
          )
        ) {
          accumulatedMessage.isGeneratingImage = true;
        }

        if (!isTyping) typeNextChar();
      }

      // Xử lý image data từ stream - ƯU TIÊN CAO NHẤT
      if (parsedData?.image) {
        console.log("Processing image:", parsedData.image);

        // Normalize path separators cho cross-platform compatibility
        const fixedImageUrl = parsedData.image
          .replace(/\\\\/g, "/")
          .replace(/\\/g, "/");
        console.log("Fixed image URL:", fixedImageUrl);

        // Initialize images array nếu chưa có
        if (!accumulatedMessage.images) {
          accumulatedMessage.images = [];
        }

        // Thêm image vào mảng
        accumulatedMessage.images.push(fixedImageUrl);

        // Tắt trạng thái generating vì đã có ảnh
        accumulatedMessage.isGeneratingImage = false;

        // Render ngay lập tức để hiển thị ảnh
        renderCurrentContent();
      }

      // Update temp reference cho access từ other functions
      tempTextRef.current = { ...accumulatedMessage };
    };

    /**
     * Typing effect - render từng ký tự một cách mượt mà
     */
    const typeNextChar = () => {
      if (!tempRef.current || !waitingRef.current || textQueue.length === 0) {
        isTyping = false;
        return;
      }

      isTyping = true;
      const char = textQueue.shift();
      currentRawText += char;

      renderCurrentContent();

      // Delay 20ms giữa các ký tự để tạo hiệu ứng typing
      setTimeout(typeNextChar, 20);
    };

    /**
     * Hoàn thành stream và lưu message cuối cùng
     */
    const finishStream = () => {
      // Tắt tất cả loading states
      accumulatedMessage.isGeneratingImage = false;

      // Tạo final content từ accumulated text
      let finalContent = currentRawText + textQueue.join("");

      const finalMessage = {
        ...accumulatedMessage,
        content: finalContent, // CHỈ LƯU TEXT CONTENT, KHÔNG CÓ HTML
        // Images sẽ được render riêng bởi component hiển thị message
      };

      // Render lần cuối với tempRef (để hiển thị trong quá trình stream)
      renderCurrentContent();

      // Thêm message vào store với content CHỈ chứa text
      useChatStore.getState().addMessage(finalMessage);
      setIsStreaming(false);
      waitingRef.current = false;
    };

    try {
      // Khởi tạo AbortController mới cho request
      abortControllerRef.current = new AbortController();

      // Hiển thị loading ngay từ đầu
      showLoadingState();

      // Gọi API streaming
      const response = await httpClientSSE(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + "generation",
        {},
        form,
        "POST",
        true,
        abortControllerRef.current.signal
      );

      if (!response.ok) {
        const response = await httpClientSSE(
          process.env.NEXT_PUBLIC_ENDPOINT_URL + "generation",
          {},
          form,
          "POST",
          true,
          abortControllerRef.current.signal
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Xử lý streaming response
      const reader = response.data.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";

      /**
       * Đọc từng chunk từ stream recursively
       */
      function readChunk() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done || !waitingRef.current) {
              finishStream();
              return;
            }

            // Decode và parse SSE data
            sseBuffer += decoder.decode(value);
            let events = sseBuffer.split("\n\n");
            sseBuffer = events.pop();

            // Xử lý từng event
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

            // Tiếp tục đọc chunk tiếp theo
            readChunk();

            // Kiểm tra scroll function nếu có
            if (typeof checkScroll === "function") {
              checkScroll();
            }
          })
          .catch((error) => {
            // Không log AbortError vì đây là hành vi bình thường khi cancel
            if (error.name === "AbortError") {
              console.log("Stream was aborted");
              return;
            }
            console.error("Stream reading error:", error);
            finishStream();
          });
      }

      readChunk();
    } catch (error) {
      console.error("Request error:", error);

      // Hiển thị error UI
      if (tempRef.current) {
        tempRef.current.innerHTML = `
          <div style="
            padding: 16px; 
            color: #e74c3c; 
            background: #fdf2f2; 
            border-radius: 8px; 
            border-left: 4px solid #e74c3c;
          ">
            <strong>❌ Lỗi kết nối</strong><br>
            Không thể kết nối đến server. Vui lòng thử lại sau.
            <div style="margin-top: 8px; font-size: 12px; color: #999;">
              Error: ${error.message}
            </div>
          </div>
        `;
      }

      setIsStreaming(false);
      waitingRef.current = false;
    }
  };

  /**
   * Kiểm tra scroll position và hiện/ẩn nút back to bottom
   */
  const checkScroll = () => {
    if (!messageRef.current || !backToBotRef.current) return;

    const scrollTop = messageRef.current.scrollTop;
    const windowHeight = messageRef.current.offsetHeight;
    const fullHeight = messageRef.current.scrollHeight;

    const distanceFromBottom = fullHeight - (scrollTop + windowHeight);

    // Hiện nút back to bottom nếu scroll lên xa khỏi đáy
    if (distanceFromBottom > 100) {
      backToBotRef.current.classList.remove("opacity-0");
      backToBotRef.current.classList.add("opacity-100");
    } else {
      backToBotRef.current.classList.remove("opacity-100");
      backToBotRef.current.classList.add("opacity-0");
    }
  };

  /**
   * Đóng modal preview ảnh
   */
  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  /**
   * Mở modal preview ảnh
   * @param {string} imageUrl - URL ảnh cần preview
   */
  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
  };

  // Setup scroll listener và expose preview function to global
  useEffect(() => {
    // Thêm scroll listener
    if (messageRef.current) {
      messageRef.current.addEventListener("scroll", checkScroll);
      checkScroll(); // Gọi 1 lần để set đúng trạng thái ban đầu
    }

    // Expose preview function to global scope để có thể gọi từ HTML string
    if (typeof window !== "undefined") {
      window.rosoPreviewImage = handlePreviewImage;
    }

    return () => {
      // Cleanup scroll listener
      if (messageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        messageRef?.current.removeEventListener("scroll", checkScroll);
      }

      // Cleanup global function
      if (typeof window !== "undefined") {
        delete window.rosoPreviewImage;
      }
    };
  }, []);

  console.log("Preview image state:", previewImage);

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

      {/* Modal Preview ảnh với improved UX */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClosePreview}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {/* Nút đóng với better positioning */}
            <button
              onClick={handleClosePreview}
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
              title="Đóng (ESC)"
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

            {/* Ảnh preview với loading state */}
            <ImageCustom
              width={0}
              height={0}
              src={previewImage}
              alt="Preview"
              className="max-w-full min-h-[calc(100vh/2)] max-h-[90vh] w-fit object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onLoad={() => console.log("Preview image loaded successfully")}
              onError={() => console.error("Preview image failed to load")}
            />

            {/* Loading spinner cho ảnh preview */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="animate-pulse bg-gray-200 rounded-lg"
                style={{
                  width: "200px",
                  height: "200px",
                  display: "none",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </RosoContext.Provider>
  );
};

export default RosoProvider;
