"use client";

import { useContext, useEffect } from "react";
import { BuilderContext } from "../providers/BuilderProvider";

const addLabelForBlock = (name, icon) => {
  return `<div>
    <div style="display:flex; flex-direction:column; gap:12px; align-items:center; justify-content:center; margin-top:10px">
      <img src="${icon}" alt="Image">
      <span style="font-size:20px">${name}</span>
    </div>`;
};
const BlockManager = () => {
  const { editor } = useContext(BuilderContext);
  useEffect(() => {
    if (editor) {
      // GRID
      editor.BlockManager.add("grid-container", {
        label: "Grid Container",
        content: `
         <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(100% / 12 - 10px), 1fr)); gap: 10px; padding: 10px; border: 1px solid #ccc;">
            <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });

      editor.BlockManager.add("grid-item", {
        label: "Grid Three",
        content: `
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
          <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border: 1px solid #ddd;">
              <!-- Add blocks here -->
          </div>
        `,
        category: "Layout",
      });

      // BASIC
      editor.BlockManager.add("text", {
        label: addLabelForBlock("Text", "/next.svg"), // Tên hiển thị của block
        content: "<div>Nhập text vào đây nào</div>", // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });

      editor.BlockManager.add("image", {
        label: addLabelForBlock("Image", "/next.svg"), // Tên hiển thị của block
        content: `<img src="/next.svg" />`, // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });

      editor.BlockManager.add("button", {
        label: addLabelForBlock("Button", "/next.svg"), // Tên hiển thị của block
        content: `<button>Click</button>`, // Nội dung block
        category: "Basic", // Danh mục trong block manager
      });
    }
  }, [editor]);
  return null;
};

export default BlockManager;
