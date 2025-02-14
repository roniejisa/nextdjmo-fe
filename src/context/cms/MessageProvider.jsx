"use client";
import { createContext, useState, useRef } from "react";

export const MessageContext = createContext();
const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);
  const heightChat = 52;
  const [editorHeight, setEditorHeight] = useState(heightChat);
  const [waiting, setWaiting] = useState(false);
  const [formValue, setFormValue] = useState("");
  const [fileTransfers, setFileTransfers] = useState(false);
  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        editorHeight,
        setEditorHeight,
        heightChat,
        waiting,
        setWaiting,
        formValue,
        setFormValue,
        fileTransfers,
        setFileTransfers,
        messageRef
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
