"use client";

import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";
import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const mapTailwindStyleToDocx = (el) => {
  const style = {};

  if (el.classList.contains("font-bold")) {
    style.bold = true;
  }
  if (el.classList.contains("italic")) {
    style.italics = true;
  }
  if (el.classList.contains("underline")) {
    style.underline = {};
  }
  if (el.classList.contains("text-red-500")) {
    style.color = "FF0000";
  }
  if (el.classList.contains("text-blue-500")) {
    style.color = "3B82F6";
  }
  if (el.classList.contains("text-lg")) {
    style.size = 28;
  }
  if (el.classList.contains("text-xl")) {
    style.size = 32;
  }

  return style;
};

// Parse 1 DOM node → Paragraph
const parseElementToParagraph = (el) => {
  if (!el || el.nodeType !== 1) return null;

  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes);
  const runs = [];

  for (const child of children) {
    if (child.nodeType === 3) {
      // Text
      runs.push(new TextRun({ text: child.textContent || "" }));
    } else if (child.nodeType === 1) {
      const childEl = child;
      const style = mapTailwindStyleToDocx(childEl);
      runs.push(new TextRun({ text: childEl.textContent || "", ...style }));
    }
  }

  const paragraphStyle = {};
  if (el.classList.contains("text-center")) {
    paragraphStyle.alignment = AlignmentType.CENTER;
  }

  return new Paragraph({ children: runs, ...paragraphStyle });
};


const DownloadTools = ({
  rawMarkdown,
  fileName = "output",
  printTargetRef,
}) => {
  const extractTitle = () => {
    const match = rawMarkdown.match(/^#\s+(.*)/);
    return match
      ? match[1]
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
      : fileName;
  };

  const getHTML = () => {
    const html = marked(rawMarkdown);
    return `<html><head><meta charset="UTF-8"></head><body>${html}</body></html>`;
  };

  const handleDownloadTXT = () => {
    const blob = new Blob([rawMarkdown], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${extractTitle()}.txt`);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([rawMarkdown], {
      type: "text/markdown;charset=utf-8",
    });
    saveAs(blob, `${extractTitle()}.md`);
  };

  const handleDownloadPDF = () => {
    if (!printTargetRef?.current) return;

    // Clone node để tránh render lỗi do animation, style động
    const clonedNode = printTargetRef.current.cloneNode(true);

    // Hàm để override các màu có chứa "oklch"
    const cleanColor = (node) => {
      const checkAndFix = (el) => {
        const computed = getComputedStyle(el);
        if (computed.color && computed.color.includes("oklch")) {
          el.style.color = "black"; // hoặc giá trị màu an toàn khác
        }
        if (
          computed.backgroundColor &&
          computed.backgroundColor.includes("oklch")
        ) {
          el.style.backgroundColor = "transparent";
        }
      };
      // Kiểm tra node gốc
      checkAndFix(node);
      // Kiểm tra tất cả phần tử con
      const elements = node.querySelectorAll("*");
      elements.forEach((el) => checkAndFix(el));
    };
    clonedNode.style.paddingBottom = "30px"; // hoặc margin-bottom
    cleanColor(clonedNode);

    // Thêm style tag để ép ghi đè toàn bộ màu (cẩn thận nếu bạn muốn giữ định dạng ban đầu)
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      * {
        color: black !important;
        background-color: transparent !important;
      }
    `;
    clonedNode.insertBefore(styleTag, clonedNode.firstChild);

    // Tạo một wrapper ẩn để vẽ canvas ổn định
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "-9999px";
    wrapper.style.left = "-9999px";
    wrapper.appendChild(clonedNode);
    document.body.appendChild(wrapper);

    html2pdf()
      .set({
        margin: 10,
        filename: `${extractTitle()}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(clonedNode)
      .save()
      .then(() => {
        document.body.removeChild(wrapper); // Dọn DOM sau khi in
      })
      .catch((err) => {
        console.error("🚨 PDF generation failed:", err);
        document.body.removeChild(wrapper);
      });
  };

  const handleDownloadDocx = async () => {
    if (!printTargetRef?.current) return;
  
    const elements = Array.from(printTargetRef.current.children);
  
    const paragraphs = elements
      .map(parseElementToParagraph)
      .filter(Boolean);
  
    const doc = new Document({
      sections: [{ children: paragraphs }],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${extractTitle()}.docx`);
  };
  

  const handlePrint = () => {
    if (!printTargetRef?.current) return;
    const baseStyle = `
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1, h2, h3 { margin-top: 24px; }
        p { margin-bottom: 12px; }
    </style>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      `<html><head><title>In tài liệu</title>${baseStyle}</head><body>`
    );
    printWindow.document.write(printTargetRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex gap-4 mt-3 flex-wrap group">
      <button onClick={handleDownloadPDF} className="bg-red-500 transition-all duration-300 hover:shadow-md group-hover:bg-red-600 active:translate-y-[1px] text-white p-2 rounded-md">
        PDF
      </button>
      <button onClick={handleDownloadDocx} className="bg-blue-500 transition-all duration-300 hover:shadow-md group-hover:bg-blue-600 active:translate-y-[1px] text-white p-2 rounded-md">
        DOCX
      </button>
      <button onClick={handleDownloadTXT} className="bg-green-500 transition-all duration-300 hover:shadow-md group-hover:bg-green-600 active:translate-y-[1px] text-white p-2 rounded-md">
        TXT
      </button>
      <button onClick={handleDownloadMD} className="bg-purple-500 transition-all duration-300 hover:shadow-md group-hover:bg-purple-600 active:translate-y-[1px] text-white p-2 rounded-md">
        Markdown
      </button>
      <button onClick={handlePrint} className="bg-gray-500 transition-all duration-300 hover:shadow-md group-hover:bg-black text-white active:translate-y-[1px] p-2 rounded-md">
        In
      </button>
    </div>
  );
};

export default DownloadTools;
