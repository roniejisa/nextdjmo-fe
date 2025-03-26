"use client";
import { getToken } from "@/utils/server/utils";
import { createContext, useState, useRef } from "react";

export const MessageContext = createContext();
const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const heightChat = 52;
  const [editorHeight, setEditorHeight] = useState(heightChat);
  const waitingRef = useRef(false);
  const [formValue, setFormValue] = useState("");
  const [fileTransfers, setFileTransfers] = useState(false);
  const [tempText, setTempText] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const tempTextRef = useRef(null);
  const editorRef = useRef(null); // Ref to focus back after sending

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
      setTempText((obj) => {
        let newObj = { ...obj };
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
          // Nếu chưa có message AI, tạo mới message AI
          newObj = {
            content: parsedData.text,
            isQuestion: false,
            form,
          };
        }
        tempTextRef.current = newObj;
        return newObj;
      });
    };

    // Khi stream kết thúc
    const finishStream = () => {
      setMessages((prev) => [...prev, tempTextRef.current]);
      setTempText(null);
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
      });
      setTimeout(() => {
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      }, 100);
    }

    readChunk();
  };

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
        setFileTransfers,
        messageRef,
        tempText,
        setTempText,
        isStreaming,
        setIsStreaming,
        tempTextRef,
        submitFormQuestion,
        editorRef,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
