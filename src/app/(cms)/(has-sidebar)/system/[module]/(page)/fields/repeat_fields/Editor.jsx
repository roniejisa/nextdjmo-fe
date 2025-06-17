"use client";
import React, { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import Group from "../../../fields/Group";
const Editor = ({ field, value, item, updateData, itemData }) => {
  const editorRef = useRef(null);
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
    }
    

    quillCurrentRef.current.on("text-change", () => {
      updateData(
        {
          target: {
            value: quillCurrentRef.current.root.innerHTML,
          },
        },
        itemData.id,
        field
      );
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (item && item?.[field.name]) {
      quillCurrentRef.current.root.innerHTML = item?.[field.name] ?? "";
    } else if (value) {
      quillCurrentRef.current.root.innerHTML = value || "";
    }
    if (quillCurrentRef.current.root.innerHTML) {
      updateData(
        {
          target: {
            value: quillCurrentRef.current.root.innerHTML,
          },
        },
        itemData.id,
        field
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <Group field={field}>
      <div ref={editorRef} style={{ height: "100px" }}></div>
    </Group>
  );
};

export default Editor;
