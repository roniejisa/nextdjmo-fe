"use client";

import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";
import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

// ==================== UTILITY FUNCTIONS ====================

/**
 * Maps Tailwind CSS classes to DOCX styling properties
 * @param {HTMLElement} el - DOM element to extract styles from
 * @returns {Object} DOCX style object
 */
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

/**
 * Converts DOM element to DOCX paragraph
 * @param {HTMLElement} el - DOM element to convert
 * @returns {Paragraph|null} DOCX paragraph or null
 */
const parseElementToParagraph = (el) => {
  if (!el || el.nodeType !== 1) return null;

  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes);
  const runs = [];

  for (const child of children) {
    if (child.nodeType === 3) {
      // Text node
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

/**
 * Extracts title from markdown content for filename
 * @param {string} rawMarkdown - Raw markdown content
 * @param {string} fallback - Fallback filename
 * @returns {string} Extracted or fallback title
 */
const extractTitleFromMarkdown = (rawMarkdown, fallback = "output") => {
  const match = rawMarkdown.match(/^#\s+(.*)/);
  return match
    ? match[1]
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "_")
    : fallback;
};

/**
 * Converts markdown to HTML
 * @param {string} rawMarkdown - Raw markdown content
 * @returns {string} HTML string
 */
const convertMarkdownToHTML = (rawMarkdown) => {
  const html = marked(rawMarkdown);
  return `<html><head><meta charset="UTF-8"></head><body>${html}</body></html>`;
};

/**
 * Cleans problematic CSS colors (oklch) for PDF generation
 * @param {HTMLElement} node - DOM node to clean
 */
const cleanProblematicColors = (node) => {
  const fixColorProperties = (el) => {
    const computed = getComputedStyle(el);
    if (computed.color && computed.color.includes("oklch")) {
      el.style.color = "black";
    }
    if (computed.backgroundColor && computed.backgroundColor.includes("oklch")) {
      el.style.backgroundColor = "transparent";
    }
  };

  // Fix root node
  fixColorProperties(node);
  
  // Fix all child elements
  const elements = node.querySelectorAll("*");
  elements.forEach(fixColorProperties);
};

// ==================== DOWNLOAD HANDLERS ====================

/**
 * Creates download handlers with shared title extraction
 * @param {string} rawMarkdown - Raw markdown content
 * @param {string} fileName - Base filename
 * @param {React.RefObject} printTargetRef - Reference to printable element
 * @returns {Object} Download handler functions
 */
const createDownloadHandlers = (rawMarkdown, fileName, printTargetRef) => {
  const getTitle = () => extractTitleFromMarkdown(rawMarkdown, fileName);

  return {
    // Text file download
    handleTxtDownload: () => {
      const blob = new Blob([rawMarkdown], { type: "text/plain;charset=utf-8" });
      saveAs(blob, `${getTitle()}.txt`);
    },

    // Markdown file download
    handleMarkdownDownload: () => {
      const blob = new Blob([rawMarkdown], {
        type: "text/markdown;charset=utf-8",
      });
      saveAs(blob, `${getTitle()}.md`);
    },

    // PDF download with advanced styling cleanup
    handlePdfDownload: () => {
      if (!printTargetRef?.current) return;

      // Clone node to avoid modifying original
      const clonedNode = printTargetRef.current.cloneNode(true);
      clonedNode.style.paddingBottom = "30px";
      
      // Clean problematic colors
      cleanProblematicColors(clonedNode);

      // Add style override for PDF generation
      const styleTag = document.createElement("style");
      styleTag.innerHTML = `
        * {
          color: black !important;
          background-color: transparent !important;
        }
      `;
      clonedNode.insertBefore(styleTag, clonedNode.firstChild);

      // Create hidden wrapper for stable rendering
      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.top = "-9999px";
      wrapper.style.left = "-9999px";
      wrapper.appendChild(clonedNode);
      document.body.appendChild(wrapper);

      html2pdf()
        .set({
          margin: 10,
          filename: `${getTitle()}.pdf`,
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
          document.body.removeChild(wrapper);
        })
        .catch((err) => {
          console.error("🚨 PDF generation failed:", err);
          document.body.removeChild(wrapper);
        });
    },

    // DOCX download with DOM parsing
    handleDocxDownload: async () => {
      if (!printTargetRef?.current) return;

      const elements = Array.from(printTargetRef.current.children);
      const paragraphs = elements
        .map(parseElementToParagraph)
        .filter(Boolean);

      const doc = new Document({
        sections: [{ children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${getTitle()}.docx`);
    },

    // Print functionality
    handlePrint: () => {
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
    },
  };
};

// ==================== UI COMPONENTS ====================

/**
 * Individual download button component with modern 3D styling
 * @param {Object} props - Button properties
 * @param {string} props.label - Button label
 * @param {string} props.bgColor - Background color classes
 * @param {string} props.hoverColor - Hover color classes
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.icon - Button icon
 * @returns {JSX.Element} Download button
 */
const DownloadButton = ({ 
  label, 
  bgColor, 
  hoverColor, 
  onClick, 
  icon 
}) => (
  <button
    onClick={onClick}
    className={`
      group relative overflow-hidden
      ${bgColor} ${hoverColor}
      text-white font-medium text-sm
      
      /* Mobile-first sizing */
      px-3 py-2 rounded-lg
      sm:px-4 sm:py-2.5 sm:rounded-xl
      lg:px-5 lg:py-3
      
      /* 3D Effects */
      shadow-lg hover:shadow-xl
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:-translate-y-1
      active:scale-95 active:translate-y-0
      
      /* Modern gradient overlay */
      before:absolute before:inset-0
      before:bg-gradient-to-r before:from-white/20 before:to-transparent
      before:opacity-0 before:transition-opacity before:duration-300
      hover:before:opacity-100
      
      /* Focus states for accessibility */
      focus:outline-none focus:ring-4 focus:ring-opacity-30
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    `}
  >
    <div className="relative flex items-center justify-center gap-2">
      {icon && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="font-semibold tracking-wide">
        {label}
      </span>
    </div>
    
    {/* Subtle shine effect */}
    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </button>
);

/**
 * Button configuration with modern icons and colors
 */
const buttonConfigs = [
  {
    key: 'pdf',
    label: 'PDF',
    bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
    hoverColor: 'hover:from-red-600 hover:to-red-700 focus:ring-red-500',
    handler: 'handlePdfDownload',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    key: 'docx',
    label: 'DOCX',
    bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500',
    handler: 'handleDocxDownload',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm5 6H7v1h2v1H7v1h2v1H6V8h3v1zm3-1v5h1v-2h1a1 1 0 000-2h-1V8h-1z" />
      </svg>
    )
  },
  {
    key: 'txt',
    label: 'TXT',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700 focus:ring-green-500',
    handler: 'handleTxtDownload',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    key: 'markdown',
    label: 'Markdown',
    bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500',
    handler: 'handleMarkdownDownload',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm2 1v10h12V5H4zm1 2h10v1H5V7zm0 3h8v1H5v-1z" />
      </svg>
    )
  },
  {
    key: 'print',
    label: 'In',
    bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
    hoverColor: 'hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500',
    handler: 'handlePrint',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14a1 1 0 011-1h8a1 1 0 011 1v2H5v-2z" clipRule="evenodd" />
      </svg>
    )
  }
];

// ==================== MAIN COMPONENT ====================

/**
 * Modern DownloadTools component with 3D effects and responsive design
 * @param {Object} props - Component props
 * @param {string} props.rawMarkdown - Raw markdown content
 * @param {string} props.fileName - Base filename (default: "output")
 * @param {React.RefObject} props.printTargetRef - Reference to printable element
 * @returns {JSX.Element} DownloadTools component
 */
const DownloadTools = ({
  rawMarkdown,
  fileName = "output",
  printTargetRef,
}) => {
  // Create download handlers
  const handlers = createDownloadHandlers(rawMarkdown, fileName, printTargetRef);

  return (
    <div className="w-full">
      {/* Header with subtle animation */}
      <div className="mb-4 opacity-100 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Tải xuống tài liệu
        </h3>
      </div>

      {/* Button grid with responsive layout */}
      <div className="
        grid grid-cols-2 gap-3
        sm:grid-cols-3 sm:gap-4
        md:flex md:flex-wrap md:gap-4
        lg:gap-5
        
        /* Container styling */
        p-4 rounded-2xl
        bg-gradient-to-br from-gray-50/80 to-white/60
        backdrop-blur-sm border border-gray-200/50
        shadow-lg hover:shadow-xl
        transition-all duration-500
        
        /* Hover group effect */
        group hover:bg-gradient-to-br hover:from-gray-50 hover:to-white
      ">
        {buttonConfigs.map((config) => (
          <DownloadButton
            key={config.key}
            label={config.label}
            bgColor={config.bgColor}
            hoverColor={config.hoverColor}
            onClick={handlers[config.handler]}
            icon={config.icon}
          />
        ))}
      </div>

      {/* Subtle footer info */}
      <div className="mt-3 text-xs text-gray-500 text-center opacity-70">
        Chọn định dạng để tải xuống tài liệu
      </div>
    </div>
  );
};

export default DownloadTools;