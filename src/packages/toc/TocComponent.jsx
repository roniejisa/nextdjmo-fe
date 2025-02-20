"use client";
import React, { useEffect, useState } from "react";

/**
 * Hàm chuyển danh sách các heading (với level từ 1 đến 6) thành cây mục lục.
 */
function buildTOCTree(headings) {
  const toc = [];
  const stack = [];

  headings.forEach((heading) => {
    // Mỗi mục trong TOC có thêm mảng con (children)
    const item = { ...heading, children: [] };
    // Pop các phần tử có level bằng hoặc lớn hơn level hiện tại
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      toc.push(item);
      stack.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
      stack.push(item);
    }
  });
  return toc;
}

/**
 * Component hiển thị một mục trong TOC, có khả năng ẩn/hiện các mục con.
 */
const TOCItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const header = document.querySelector(`header`);
    if (element && header) {
      const offset = element.offsetTop - header.offsetHeight;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };
  return (
    <li className="ml-2 mt-1">
      <div className="flex items-center">
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-1 focus:outline-none"
            title={isOpen ? "Ẩn các mục con" : "Hiện các mục con"}
          >
            {isOpen ? (
              // Icon mũi tên xuống
              <svg
                className="w-4 h-4 text-white transform rotate-0 transition-transform duration-200"
                viewBox="0 0 20 20"
              >
                <path d="M14 10l-6 6V4l6 6z" fill="currentColor" />
              </svg>
            ) : (
              // Icon mũi tên phải
              <svg
                className="w-4 h-4 text-white transform rotate-90 transition-transform duration-200"
                viewBox="0 0 20 20"
              >
                <path d="M14 10l-6 6V4l6 6z" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
        <a
          href={`#${item.id}`}
          onClick={(e) => handleScroll(e, item.id)}
          className="text-white hover:underline"
        >
          {item.text}
        </a>
      </div>
      {hasChildren && isOpen && (
        <ul className="ml-2 pl-2">
          {item.children.map((child) => (
            <TOCItem key={child.id} item={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Component Mục lục (Table of Contents).
 * Nó nhận một ref đến nội dung bài viết và tự động trích xuất các tiêu đề (h1 - h6).
 */
const TableOfContents = ({ contentRef }) => {
  const [tocTree, setTocTree] = useState([]);

  useEffect(() => {
    if (contentRef.current) {
      // Lấy tất cả các thẻ từ h1 đến h6
      const elements =
        contentRef.current.querySelectorAll("h2, h3, h4, h5, h6");
      const headings = Array.from(elements).map((heading, index) => {
        const level = parseInt(heading.tagName.substring(1), 10); // "H1" -> 1, "H2" -> 2,...
        // Nếu chưa có id, tự tạo dựa vào nội dung và chỉ số
        const id =
          heading.id ||
          heading.textContent.trim().replace(/\s+/g, "-").toLowerCase() +
            "-" +
            index;
        heading.id = id;
        return { id, text: heading.textContent, level };
      });
      // Xây dựng cây TOC từ danh sách phẳng các tiêu đề
      const tree = buildTOCTree(headings);
      setTocTree(tree);
    }
  }, [contentRef]);

  return (
    <nav className="p-4 bg-[#413b41] rounded shadow-md">
      <h3 className="text-lg font-bold mb-2 text-white">Mục lục</h3>
      <ul>
        {tocTree.map((item) => (
          <TOCItem key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
