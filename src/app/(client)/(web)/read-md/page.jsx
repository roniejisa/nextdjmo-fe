"use client";
import React, { useState, useCallback, useEffect } from "react";
import {
  Upload,
  FileText,
  Eye,
  Loader2,
  X,
  Code2,
  Sparkles,
  Zap,
  Star,
  Sun,
  Moon,
  Settings,
  Copy,
  Check,
} from "lucide-react";
import * as mammoth from "mammoth";
import "./DocumentReader.scss";
import Loading from "./Loading";

const useTheme = () => {
  const [theme, setTheme] = useState("system");
  const [actualTheme, setActualTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // Đánh dấu component đã mount ở client
  useEffect(() => {
    setMounted(true);

    // Khôi phục theme từ localStorage
    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
  }, []);

  // Theme detection and management
  useEffect(() => {
    if (!mounted) return; // Chỉ chạy sau khi mount

    const detectTheme = () => {
      let newActualTheme;
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        newActualTheme = prefersDark ? "dark" : "light";
      } else {
        newActualTheme = theme;
      }

      setActualTheme(newActualTheme);

      // Lưu vào localStorage
      localStorage.setItem("theme", theme);

      // Áp dụng theme vào document
      document.documentElement.setAttribute("data-theme", newActualTheme);
      document.documentElement.classList.toggle(
        "dark",
        newActualTheme === "dark"
      );
    };

    detectTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", detectTheme);
      return () => mediaQuery.removeEventListener("change", detectTheme);
    }
  }, [theme, mounted]);

  // Tránh hydration mismatch - render placeholder cho đến khi mounted
  if (!mounted) {
    return {
      theme: "system",
      actualTheme: "dark",
      setTheme: () => {},
      mounted: false,
    };
  }

  return { theme, actualTheme, setTheme, mounted };
};

const COPIED_HTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          Copied!`;

const COPY_HTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy`;

const DocumentReader = () => {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [copiedBlocks, setCopiedBlocks] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileType, setFileType] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const { theme, actualTheme, setTheme, mounted } = useTheme();
  // Áp dụng theme ngay khi component mount (tránh flash)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", actualTheme);
    document.documentElement.classList.toggle("dark", actualTheme === "dark");
  }, [actualTheme]);

  // Load enhanced syntax highlighting
  useEffect(() => {
    // Remove existing styles
    const existingStyles = document.querySelectorAll(
      'link[href*="highlight.js"], style[data-hljs]'
    );
    existingStyles.forEach((style) => style.remove());

    const isDark = actualTheme === "dark";
    const hlTheme = isDark ? "vs2015" : "github";

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${hlTheme}.min.css`;
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
    script.onload = () => {
      if (window.hljs) {
        window.hljs.configure({
          languages: [
            "javascript",
            "typescript",
            "python",
            "java",
            "cpp",
            "c",
            "css",
            "html",
            "json",
            "markdown",
          ],
          ignoreUnescapedHTML: true,
        });
        window.hljs.highlightAll();
      }
    };
    document.head.appendChild(script);

    return () => {
      const links = document.querySelectorAll('link[href*="highlight.js"]');
      const scripts = document.querySelectorAll('script[src*="highlight.js"]');
      const styles = document.querySelectorAll("style[data-hljs]");

      links.forEach((link) => link.remove());
      scripts.forEach((script) => script.remove());
      styles.forEach((style) => style.remove());
    };
  }, [actualTheme]);

  useEffect(() => {
    if (content && window.hljs) {
      window.hljs.highlightAll();
    }
  }, [content, actualTheme]);

  // Global copy function for markdown code blocks
  useEffect(() => {
    window.copyCode = async (blockId, encodedCode) => {
      try {
        const code = decodeURIComponent(encodedCode);
        await navigator.clipboard.writeText(code);

        // Update button UI
        const button = document.querySelector(
          `[data-block-id="${blockId}"] .copy-button`
        );
        if (button) {
          const originalHTML = button.innerHTML;
          button.innerHTML = COPIED_HTML;
          button.classList.add("copied");

          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove("copied");
          }, 2000);
        }
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    return () => {
      delete window.copyCode;
    };
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (
      ![
        "md",
        "docx",
        "txt",
        "js",
        "jsx",
        "ts",
        "tsx",
        "py",
        "java",
        "cpp",
        "c",
        "css",
        "html",
        "json",
      ].includes(fileExtension)
    ) {
      setError(
        "Chỉ hỗ trợ các định dạng: .md, .docx, .txt, .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .css, .html, .json"
      );
      return;
    }

    setFile(selectedFile);
    setFileType(fileExtension);
    setError("");
    setLoading(true);

    try {
      let fileContent = "";

      if (fileExtension === "docx") {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        fileContent = result.value;
      } else {
        fileContent = await selectedFile.text();
      }

      setContent(fileContent);
    } catch (err) {
      setError("Oops! Không thể đọc file này. Vui lòng thử file khác.");
      console.error("File reading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (markdown) => {
    // Tạo placeholders để bảo vệ code blocks và inline code
    const codeBlockPlaceholders = [];
    const inlineCodePlaceholders = [];

    let html = markdown
      // Bảo vệ code blocks bằng cách thay thế bằng placeholder
      .replace(/```(\w+)?([\s\S]*?)```/gim, (match, lang, code) => {
        const language = lang || "text";
        const trimmedCode = code.trim();
        const escapedCode = trimmedCode
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
        const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
        const encodedCode = encodeURIComponent(trimmedCode)
          .replace(/'/g, "%27")
          .replace(/"/g, "%22");

        const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
        codeBlockPlaceholders.push(`<div class="code-block-container" data-block-id="${blockId}">
<div class="code-block-header">
  <span>${language}</span>
  <button class="copy-button" onclick="window.copyCode(&quot;${blockId}&quot;, &quot;${encodedCode}&quot;)">
    ${COPY_HTML}
  </button>
</div>
<pre><code class="language-${language}">${escapedCode}</code></pre>
</div>`);
        return placeholder;
      })

      // Bảo vệ inline code bằng placeholder
      .replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
        inlineCodePlaceholders.push(`<code>${code}</code>`);
        return placeholder;
      })

      // Headers
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
      .replace(/^###### (.*$)/gim, "<h6>$1</h6>")

      // Bold and italic - giờ đây an toàn vì code đã được bảo vệ
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')

      // Horizontal rules
      .replace(/^---$/gim, "<hr>")
      .replace(/^\*\*\*$/gim, "<hr>")

      // Blockquotes
      .replace(/^> (.*$)/gim, "<blockquote><p>$1</p></blockquote>")

      // Unordered lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")

      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

    // Khôi phục code blocks
    codeBlockPlaceholders.forEach((replacement, index) => {
      html = html.replace(`__CODEBLOCK_${index}__`, replacement);
    });

    // Khôi phục inline code
    inlineCodePlaceholders.forEach((replacement, index) => {
      html = html.replace(`__INLINECODE_${index}__`, replacement);
    });
    return html;
  };

  const getLanguageFromExtension = (ext) => {
    const langMap = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      css: "css",
      html: "html",
      json: "json",
      md: "markdown",
      txt: "plaintext",
    };
    return langMap[ext] || "plaintext";
  };

  const renderCodeWithHighlighting = (code, language) => {
    let processedCode = code;

    if (language === "json") {
      try {
        const parsed = JSON.parse(code);
        processedCode = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Keep original if not valid JSON
      }
    }

    const blockId = `code-${Math.random().toString(36).substr(2, 9)}`;
    const isCopied = copiedBlocks.has(blockId);

    return (
      <div className="code-block-container">
        <div className="code-block-header">
          <span>{language}</span>
          <button
            onClick={(e) => copyToClipboard(e, processedCode, blockId)}
            className={`copy-button`}
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
        <pre className="hljs">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{
              __html:
                window.hljs?.highlight(processedCode, { language }).value ||
                processedCode,
            }}
          />
        </pre>
      </div>
    );
  };

  const copyToClipboard = async (e, text, blockId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks((prev) => new Set([...prev, blockId]));
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockId);
          return newSet;
        });
      }, 2000);
      e.target.classList.add("copied");
      e.target.innerHTML = COPIED_HTML;
      setTimeout(() => {
        e.target.innerHTML = COPY_HTML;
        e.target.classList.remove("copied");
      }, 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clearFile = () => {
    setFile(null);
    setContent("");
    setError("");
    setFileType("");
  };

  const isCodeFile = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "py",
    "java",
    "cpp",
    "c",
    "css",
    "html",
    "json",
  ].includes(fileType);

  const getFileTypeIcon = (type) => {
    const iconMap = {
      js: "🟨",
      jsx: "⚛️",
      ts: "🔷",
      tsx: "🔷",
      py: "🐍",
      java: "☕",
      cpp: "⚡",
      c: "🔧",
      css: "🎨",
      html: "🌐",
      json: "📋",
      md: "📝",
      txt: "📄",
    };
    return iconMap[type] || "📄";
  };

  const isDark = actualTheme === "dark";
  if (!mounted) {
    return <Loading />; // hoặc skeleton UI
  }
  return (
    <div className={`document-reader ${isDark ? "dark" : "light"}`}>
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>

      <div className="content-container">
        {/* Premium Header with Theme Toggle */}
        <div className="header">
          <div className="theme-toggle">
            <div className="theme-toggle-container">
              <button
                onClick={() => setTheme("light")}
                className={`theme-btn ${theme === "light" ? "active" : ""}`}
              >
                <Sun className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`theme-btn ${theme === "dark" ? "active" : ""}`}
              >
                <Moon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`theme-btn ${theme === "system" ? "active" : ""}`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          {!file && (
            <>
              <div className="logo-container">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="main-title">
                <span className="gradient-text">Code Reader Pro</span>
              </h1>
              <p className="subtitle">
                Trải nghiệm đọc code & document đẳng cấp với AI-powered syntax
                highlighting
              </p>
              <div className="rating">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <span className="rating-text">
                  Được tin dùng bởi 10,000+ developers
                </span>
              </div>
            </>
          )}
        </div>

        {/* Premium Upload Area */}
        {!file && (
          <div
            className={`upload-area ${isDragOver ? "drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".md,.docx,.txt,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.css,.html,.json"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="file-input"
            />

            <div className="upload-content">
              <div className="upload-icon-container">
                <div className="upload-icon-bg"></div>
                <div className="upload-icon">
                  <Upload className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="upload-text">
                <h3 className="upload-title">
                  Thả file hoặc click để bắt đầu magic ✨
                </h3>
                <p className="upload-description">
                  Hỗ trợ đầy đủ các ngôn ngữ lập trình phổ biến & documents
                </p>

                <div className="supported-formats">
                  {[
                    { icon: "🟨", title: "JavaScript", desc: "JS, JSX" },
                    { icon: "🔷", title: "TypeScript", desc: "TS, TSX" },
                    { icon: "🐍", title: "Python", desc: "PY" },
                    { icon: "☕", title: "Java", desc: "JAVA" },
                    { icon: "📝", title: "Documents", desc: "MD, DOCX, TXT" },
                  ].map((item, index) => (
                    <div key={index} className="format-card">
                      <div className="format-icon">{item.icon}</div>
                      <h4 className="format-title">{item.title}</h4>
                      <p className="format-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium File Display */}
        {file && (
          <div className="file-display">
            {/* Enhanced File Header */}
            <div className="file-header">
              <div className="file-info">
                <div className="file-icon">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="file-details">
                  <h2 className="file-name">
                    <span className="file-type-icon">
                      {getFileTypeIcon(fileType)}
                    </span>
                    {file.name}
                  </h2>
                  <div className="file-meta">
                    <span className="file-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    <span className="file-type-badge">
                      {fileType.toUpperCase()}
                    </span>
                    <div className="enhanced-badge">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Enhanced</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="file-actions">
                <div className="preview-icon">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <button onClick={clearFile} className="close-button">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Display */}
            <div className="file-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-content">
                    <Loader2 className="loading-spinner" />
                    <p className="loading-text">
                      Đang xử lý với AI magic... ✨
                    </p>
                    <div className="loading-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="error-container">
                  <div className="error-icon">😵</div>
                  <h3 className="error-title">Oops! Có lỗi xảy ra</h3>
                  <p className="error-message">{error}</p>
                </div>
              ) : content ? (
                <div className="content-display">
                  {fileType === "md" ? (
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(content),
                      }}
                    />
                  ) : fileType === "docx" ? (
                    <div
                      className="markdown-body"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : isCodeFile ? (
                    renderCodeWithHighlighting(
                      content,
                      getLanguageFromExtension(fileType)
                    )
                  ) : (
                    <div className="markdown-body">
                      <pre className="hljs">
                        <code>{content}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Premium Footer */}
        {!file && (
          <div className="footer">
            <div className="footer-brand">
              <Code2 className="footer-icon" />
              <span className="footer-text">Powered by Advanced AI</span>
            </div>
            <p className="footer-copyright">
              © 2024 Code Reader Pro. Nâng tầm trải nghiệm đọc code của bạn.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentReader;
