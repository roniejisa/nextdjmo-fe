/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import styles from "./CustomEditor.module.scss";
import debounce from "lodash/debounce";

const CustomEditor = forwardRef(function CustomEditor(
  { placeholder = "Question for me?", sendContent, submitForm, className = "", },
  ref
) {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");

  // Debounce sendContent để hạn chế việc gọi liên tục
  const debouncedSendContent = useCallback(
    debounce((text) => {
      sendContent(text);
    }, 300),
    [sendContent]
  );

  const getText = () => {
    const editor = editorRef.current;
    if (!editor) return "";
    const text = editor.innerText.trim();
    if (editor.innerHTML === "<br>" || text.length === 0) {
      editor.innerHTML = "";
    }
    return editor.innerText.trim();
  };

  useImperativeHandle(
    ref,
    () => ({
      clearData() {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          debouncedSendContent("");
        }
      },
      getData() {
        return getText();
      },
      focus() {
        editorRef.current && editorRef.current.focus();
      },
    }),
    [debouncedSendContent]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!e.shiftKey && e.code === "Enter") {
        e.preventDefault();
        submitForm();
        return;
      }
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (["b", "i", "u", "s", "k"].includes(key)) {
          e.preventDefault();
        }
      }
    },
    [submitForm]
  );

  const handleKeyUp = useCallback(() => {
    const text = getText();
    setContent(text);
    debouncedSendContent(text);
  }, [debouncedSendContent]);

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      let text = clipboardData.getData("text");

      // Xử lý hình ảnh
      for (const item of clipboardData.items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          const imgURL = URL.createObjectURL(blob);
          // Chèn ảnh vào editor thay vì document.body
          if (document.execCommand) {
            document.execCommand(
              "insertHTML",
              false,
              `<img src="${imgURL}" style="max-width:300px;" />`
            );
          }
        }
      }
      // Chèn văn bản (nếu có)
      if (document.execCommand) {
        document.execCommand("insertText", false, text);
      } else {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      const updatedText = getText();
      setContent(updatedText);
      debouncedSendContent(updatedText);
    },
    [debouncedSendContent]
  );

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable="true"
        className={className || styles.editor}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      ></div>
    </div>
  );
});

export default CustomEditor;
