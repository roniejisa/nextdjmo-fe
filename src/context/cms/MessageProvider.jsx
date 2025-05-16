"use client";
import { getToken } from "@/utils/server/utils";
import { marked } from "marked";
import { createContext, useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import DOMPurify from "dompurify";

export const MessageContext = createContext();
const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const heightChat = 62 + 16 * 2;
  const [editorHeight, setEditorHeight] = useState(heightChat);
  const waitingRef = useRef(false);
  const [formValue, setFormValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const tempTextRef = useRef(null);
  const editorRef = useRef(null); // Ref to focus back after sending
  const tempRef = useRef(null);
  const backToBotRef = useRef(null);

  const submitFormQuestion = async (
    form,
    isRefresh = false,
    isAgain = false
  ) => {
    if (waitingRef.current) {
      waitingRef.current = false;
      setIsStreaming(false);
      return;
    }
    tempRef.current.innerHTML = `Đang suy luận!`;
    const token = await getToken();
    let data = "";
    if (isAgain) {
      data = form.get("message");
    } else {
      data = editorRef.current.getData();
      if (data.length === 0) return;
      // SET MESSAGE O DAY
      setMessages([
        ...messages,
        {
          content: data,
          isQuestion: true,
        },
      ]);
    }
    waitingRef.current = true;
    setIsStreaming(true);

    form.append("model", document.getElementById("model").value);
    editorRef.current.clearData();
    editorRef.current.focus();
    setFormValue(Object.fromEntries(form));
    // Giả sử đây là hàm xử lý từng chunk SSE:
    const handleStreamChunk = (parsedData) => {
      // Scroll xuống cuối trước
      window.scrollTo(tempTextRef);
      let newObj;
      const obj = tempTextRef.current;

      if (typeof tempTextRef.current === "object") {
        newObj = tempTextRef.current;
      } else {
        tempRef.current.innerHTML = "";
      }

      if (obj && !obj.isQuestion) {
        newObj = {
          ...obj,
          content: obj.content + parsedData.text,
        };
      } else if (parsedData?.image) {
        newObj = {
          content: `<div class="preview-img"><img src="${parsedData?.image}" style="max-height:500px;width:auto"></div>`,
          isQuestion: false,
          form,
        };
      } else {
        newObj = {
          content: parsedData.text,
          isQuestion: false,
          form,
        };
      }

      tempTextRef.current = newObj;

      // ✅ Gộp phần chưa gõ xong trong queue để in ra ngay lập tức
      const unfinished = textQueue.join("");
      currentRawText += unfinished;

      // ✅ Render toàn bộ nội dung đã có
      const fullHTML = DOMPurify.sanitize(marked.parse(currentRawText));
      tempRef.current.innerHTML = fullHTML;

      tempRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });

      // ✅ Reset queue: chỉ gõ từ từ phần mới
      textQueue = Array.from(parsedData.text);

      // ✅ Tiếp tục typing
      if (!isTyping) typeNextChar();
    };

    const typeNextChar = () => {
      if (!tempRef.current || !waitingRef.current || textQueue.length === 0) {
        isTyping = false;
        return;
      }

      isTyping = true;

      // Gỡ từng ký tự để thêm dần
      const char = textQueue.shift();
      currentRawText += char;

      // Re-render với phần mới cập nhật
      const html = DOMPurify.sanitize(marked.parse(currentRawText));
      tempRef.current.innerHTML = html;

      tempRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });

      setTimeout(typeNextChar, 20); // tốc độ typing
      // ✅ Scroll xuống cuối sau mỗi chunk
      // messageRef.current.scrollTo({
      //   top: messageRef.current.scrollHeight,
      //   behavior: "smooth",
      // });
    };
    // Khi stream kết thúc
    const finishStream = () => {
      setMessages((prev) => [...prev, tempTextRef.current]);
      setIsStreaming(false);
    };
    
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "generation",
      {
        method: "POST",
        headers: {
          "X-API-KEY": 123456,
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    // const checkData = await response.json();
    // try {
    //   if (checkData.status === 401 && !isRefresh) {
    //     if (updateToken()) {
    //       return await submitFormQuestion(form, true);
    //     }
    //   }
    // } catch (e) {}

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let sseBuffer = "";
    
    let currentRawText = ""; // Phần đã hiển thị
    let textQueue = []; // Hàng đợi ký tự đang gõ
    let isTyping = false;
    function readChunk() {
      reader.read().then(({ done, value }) => {
        if (done || !waitingRef.current) {
          finishStream();
          setIsStreaming(false);
          waitingRef.current = false;
          return true;
        }

        sseBuffer += decoder.decode(value);
        let events = sseBuffer.split("\n\n");
        // Phần cuối có thể chưa đủ data, giữ lại
        sseBuffer = events.pop();

        events.forEach((event) => {
          // Lấy các dòng bắt đầu bằng "data: "
          const lines = event
            .split("\n")
            .filter((line) => line.startsWith("data: "));

          lines.forEach((line) => {
            const jsonStr = line.substring("data: ".length).trim();
            try {
              const parsedData = JSON.parse(jsonStr);
              // Xác định index của message cuối cùng trong state
              handleStreamChunk(parsedData);
            } catch (err) {
              console.error("JSON parse error:", err, "Line:", jsonStr);
            }
          });
        });
        readChunk();
        checkScroll();
      });
    }

    readChunk();
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
  useEffect(() => {
    messageRef.current.addEventListener("scroll", checkScroll);
    checkScroll(); // gọi 1 lần để set đúng trạng thái ban đầu

    return () => {
      if (messageRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        messageRef?.current.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        editorHeight,
        setEditorHeight,
        heightChat,
        waitingRef,
        formValue,
        setFormValue,
        fileTransfers,
        messageRef,
        isStreaming,
        setIsStreaming,
        tempTextRef,
        submitFormQuestion,
        editorRef,
        tempRef,
        backToBotRef,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
