"use client";

import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import { marked } from "marked";

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

  const handleDownloadDocx = () => {
    if (!printTargetRef?.current) return;
    const baseStyle = `
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1, h2, h3 { margin-top: 24px; }
        p { margin-bottom: 12px; }
    </style>
    `;
    const html = `<html><head><meta charset="utf-8">${baseStyle}</head><body>${printTargetRef.current.innerHTML}</body></html>`;
    const converted = htmlDocx.asBlob(html);
    saveAs(converted, `${extractTitle()}.docx`);
  };

  const handlePrint = () => {
    if (!printTargetRef?.current) return;

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
    <div className="flex gap-2 mt-3 flex-wrap">
      <button onClick={handleDownloadPDF} className="btn">
        PDF
      </button>
      <button onClick={handleDownloadDocx} className="btn">
        DOCX
      </button>
      <button onClick={handleDownloadTXT} className="btn">
        TXT
      </button>
      <button onClick={handleDownloadMD} className="btn">
        Markdown
      </button>
      <button onClick={handlePrint} className="btn">
        In
      </button>
    </div>
  );
};

export default DownloadTools;
