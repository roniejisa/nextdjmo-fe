"use client";
import React, { useEffect, useId, useRef } from "react";
import "quill/dist/quill.snow.css";
const Editor = ({ defaultValue, item, field, oldData }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const quillCurrentRef = useRef(null);
  const id = useId();
  useEffect(() => {
    const Quill = require("quill");
    if (!quillCurrentRef.current) {
      quillCurrentRef.current = new Quill(document.getElementById(id), {
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
    }

    quillCurrentRef.current.on("text-change", () => {
      textareaRef.current.value = quillCurrentRef.current.root.innerHTML;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (oldData && oldData?.[field.name]) {
      textareaRef.current.value = oldData?.[field.name] ?? ""; 
    } else if (item && item[field.name]) {
      textareaRef.current.value = item[field.name];
    } else if (defaultValue) {
      textareaRef.current.value = defaultValue;
    }
    if(textareaRef.current.value){
      quillCurrentRef.current.root.innerHTML = textareaRef.current.value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldData, defaultValue]);

  return (
    <>
      <textarea
        name={field.name}
        defaultValue={
          oldData?.[field.name] ?? item?.[field.name] ?? defaultValue ?? ""
        }
        ref={textareaRef}
        hidden
      ></textarea>
      <div id={id} style={{ height: "400px" }}></div>
    </>
  );
};

export default Editor;
