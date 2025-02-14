"use client";
import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./CustomEditor.module.scss"; // Đảm bảo file CSS module này tồn tại

const CustomEditor = forwardRef(function CustomEditor(
  { placeholder = "Question for me?", sendContent, submitForm, className = "" },
  ref
) {
  const editorRef = useRef(null);
  const isPasting = useRef(false);
  useImperativeHandle(
    ref,
    () => {
      return {
        clearData() {
          editorRef.current.innerHTML = "";
          sendContent(editorRef.current.innerText.trim());
        },
        getData() {
          return editorRef.current.innerText;
        },
        focus() {
          editorRef.current.focus();
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Xử lý sự kiện nhấn phím
  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.code === "Enter") {
      e.preventDefault(); // Ngăn chặn hành động mặc định
      submitForm();
      return false;
    }
    // Xóa '<br>' đi

    // Vô hiệu hóa các phím tắt như Ctrl+B, Ctrl+I, v.v.
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      const disabledKeys = ["b", "i", "u", "s", "k"];
      if (disabledKeys.includes(key)) {
        e.preventDefault();
        // Tùy chọn: Thêm thông báo cho người dùng nếu cần
      }
    }
    sendContent(getText());
  };

  const handleKeyUp = (e) => {
    sendContent(getText());
  };

  // Xử lý sự kiện dán nội dung
  const handlePaste = (e) => {
    e.preventDefault(); // Ngăn chặn hành động dán mặc định
    isPasting.current = true;
    const clipboardData = e.clipboardData || window.clipboardData;
    let text = clipboardData.getData("text");
    const items = clipboardData.items; // Lấy dữ liệu từ clipboard

    for (const item of items) {
      console.log(item.type)
      if (item.type.startsWith("image/")) { // Kiểm tra xem có phải hình ảnh không
          const blob = item.getAsFile(); // Chuyển dữ liệu thành file
          const imgURL = URL.createObjectURL(blob); // Tạo URL để hiển thị

          // Tạo thẻ img và hiển thị ảnh
          const img = document.createElement("img");
          img.src = imgURL;
          img.style.maxWidth = "300px"; // Giới hạn kích thước ảnh
          document.body.appendChild(img);
      }
  }
    // Thay thế tab bằng 4 khoảng trắng
    // text = text.replace(/\t/g, "    ");

    // Chèn văn bản thuần tự vào vị trí con trỏ
    if (document.execCommand) {
      document.execCommand("insertText", false, text);
    } else {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(text);

      range.insertNode(textNode);
      // Di chuyển con trỏ sau đoạn văn bản đã chèn
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    sendContent(getText());
  };

  const getText = () => {
    const editor = editorRef.current;
    const text = editor.innerText.trim();
    if (editor.innerHTML === "<br>" || text.length === 0) {
      editor.innerHTML = "";
    }
    return editor.innerText.trim();
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable="true"
        className={` ${className || styles.editor}`}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPaste={handlePaste}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true} // Bỏ qua cảnh báo của React về contentEditable
      ></div>
    </div>
  );
});

export default CustomEditor;
