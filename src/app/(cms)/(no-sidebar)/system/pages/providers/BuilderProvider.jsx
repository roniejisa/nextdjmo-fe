"use client";
import React, { createContext, useEffect, useState } from "react";
import EventBuilder from "../main/EventBuilder";
import BlockManager from "../main/BlockManager";
import StyleManager from "../main/StyleManager";
import CommandManager from "../main/CommandManager";

export const BuilderContext = createContext();
const BuilderProvider = ({ children }) => {
  const [editor, setEditor] = useState(null);
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [page, setPage] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Cập nhật thông báo xác nhận
      const message = "Bạn có chắc chắn muốn rời khỏi trang này?";
      event.returnValue = message; // Cài đặt thông báo cho trình duyệt
      return message; // Một số trình duyệt yêu cầu trả về giá trị này
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  return (
    <BuilderContext.Provider
      value={{ editor, setEditor, token, setToken, id, setId, page, setPage }}
    >
      {children}
      <EventBuilder />
      <BlockManager />
      <StyleManager />
      <CommandManager />
    </BuilderContext.Provider>
  );
};

export default BuilderProvider;
