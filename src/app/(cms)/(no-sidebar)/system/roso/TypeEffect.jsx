"use client";

import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import { useMessage } from "@/hooks/useMessage";

const TypingEffect = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const containerRef = useRef(null);
  const { messageRef } = useMessage();
  useLayoutEffect(() => {
    const container = messageRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    // Nếu text mới có nhiều ký tự hơn phần đã hiển thị,
    // nghĩa là có chunk mới được thêm vào, ta chỉ tiếp tục "gõ" từ vị trí đã gõ
    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Nếu đã hiển thị đủ, gọi onComplete (nếu có)
      if (onComplete) onComplete();
    }
  }, [text, displayedText, speed, onComplete]);

  // Parse markdown cho phần chữ đã gõ ra
  const html = marked(displayedText);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  }, [displayedText]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default TypingEffect;
