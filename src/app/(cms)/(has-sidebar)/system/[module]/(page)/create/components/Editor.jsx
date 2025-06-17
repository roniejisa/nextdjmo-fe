"use client";
import React, { useContext, useEffect, useId, useRef } from "react";
import "quill/dist/quill.snow.css";
import { ImageContext } from "@/context/cms/ImageProvider";
const Editor = ({ field, defaultValue, oldData }) => {
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  const quillCurrentRef = useRef(null);
  const { setShowMedia, itemCurrent, isMultiple, choosed, setItemCurrent } =
    useContext(ImageContext);
  const id = useId();
  const handleShowUpload = () => {
    setShowMedia(id);
  };

  useEffect(() => {
    if (isMultiple) return;
    const index = itemCurrent.findIndex((item) => item.id == id);
    if (index !== -1) {
      const imageUrl = itemCurrent[index]?.data
        ? process.env.NEXT_PUBLIC_ENDPOINT_URL + itemCurrent[index]?.data.url
        : "";

      if (
        imageUrl &&
        !quillCurrentRef.current.root.innerHTML.includes(imageUrl)
      ) {
        // Chuyển sang đúng chuẩn nhưng lag kinh khủng
        // let image;
        // image = new Image();
        // image.crossOrigin = "Anonymous";
        // image.addEventListener("load", function () {
        //   let canvas = document.createElement("canvas");
        //   let context = canvas.getContext("2d");
        //   canvas.width = image.width;
        //   canvas.height = image.height;
        //   context.drawImage(image, 0, 0);
        //   quillCurrentRef.current.root.innerHTML += `<img src="${canvas.toDataURL(
        //     "image/png"
        //   )}">`;
        // });
        // image.src = imageUrl;
        // Kiểm tra tránh lặp lại
        quillCurrentRef.current.root.innerHTML += `<img src="${imageUrl}">`;
      }
      setItemCurrent([]);
      setShowMedia(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosed, itemCurrent]);

  useEffect(() => {
    const Quill = require("quill");
    if (!quillCurrentRef.current) {
      var icons = Quill.import("ui/icons");
      icons["media-cms"] =
        '<svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>';
      quillCurrentRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
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
              ["media-cms"],
            ],
            handlers: {
              "media-cms": () => {
                handleShowUpload();
              },
            },
          },
        },
      });

      if (oldData && oldData?.[field.name]) {
        quillCurrentRef.current.root.innerHTML = oldData?.[field.name] ?? "";
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
        defaultValue={oldData?.[field.name] ?? defaultValue ?? ""}
      ></textarea>
      <div ref={editorRef} style={{ height: "400px" }}></div>
    </>
  );
};

export default Editor;
