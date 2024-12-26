"use client";
import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Group from "./Group";
const Editor = ({ field, defaultValue, oldData }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const quillCurrentRef = useRef(null);
  useEffect(() => {
    const Quill = require("quill");
    if (!quillCurrentRef.current) {
      quillCurrentRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "super" }, { script: "sub" }],
            [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            [{ direction: "rtl" }, { align: [] }],
            ["link", "image", "video", "formula"],
            ["clean"],
          ],
        },
      });

      if (oldData && oldData[field.name]) {
        quillCurrentRef.current.root.innerHTML = oldData[field.name];
      } else if (defaultValue) {
        quillCurrentRef.current.root.innerHTML = defaultValue || "";
      }

      quillCurrentRef.current.on("text-change", () => {
        textareaRef.current.value = quillCurrentRef.current.root.innerHTML;
      });
      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const toolbar = editorRef.current.querySelectorAll(".ql-toolbar");
    toolbar.forEach((el, index) => {
      if (index + 1 <= toolbar.length) {
        el.style.display = "none";
      }
    });
  });

  return (
    <>
      <textarea
        name={field.name}
        ref={textareaRef}
        hidden
        defaultValue={oldData[field.name] || defaultValue || ""}
      ></textarea>
      <div ref={editorRef} style={{ height: "400px" }}></div>
    </>
  );
};

export default Editor;
