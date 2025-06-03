"use client";

import CustomEditor from "@/components/EditorCustom/EditorCustom";
import {
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";
import { RosoContext } from "@/context/cms/RosoProvider";
import { useUIStore } from "@/stories/roso/uiStore";
import { useChatStore } from "@/stories/roso/ChatStore";
import ImageCustom from "@/components/Maintain/Image";

/**
 * File Management Hook - Handles file operations with DataTransfer API
 */
const useFileManager = (setEditorHeight, boxEditorRef) => {
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // File type configurations
  const fileTypes = {
    image: {
      accept: "image/*",
      icon: "📷",
      label: "Hình ảnh",
      extensions: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    },
    video: {
      accept: "video/*",
      icon: "🎥",
      label: "Video",
      extensions: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    },
    document: {
      accept: ".pdf,.doc,.docx,.txt,.rtf",
      icon: "📄",
      label: "Tài liệu",
      extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    },
    audio: {
      accept: "audio/*",
      icon: "🎵",
      label: "Âm thanh",
      extensions: [".mp3", ".wav", ".ogg", ".m4a", ".flac"],
    },
  };

  // Handle file selection
  const handleFileSelect = (files, type) => {
    const dataTransfer = new DataTransfer();
    const newFiles = [];

    // Process selected files
    Array.from(files).forEach((file) => {
      const fileObj = {
        id: Date.now() + Math.random(),
        file,
        type,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        preview: null,
      };

      // Generate preview based on file type
      if (type === "image") {
        fileObj.preview = fileObj.url;
      } else if (type === "video") {
        // For video, we'll create a thumbnail (simplified version)
        fileObj.preview = fileObj.url;
      }

      newFiles.push(fileObj);
      dataTransfer.items.add(file);
    });

    setAttachedFiles((prev) => [...prev, ...newFiles]);
    setIsDropdownOpen(false);

    // Update editor height
    setTimeout(() => {
      if (boxEditorRef.current) {
        setEditorHeight(boxEditorRef.current.offsetHeight);
      }
    }, 100);
  };

  // Thêm cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup URLs when component unmounts
      attachedFiles.forEach((file) => {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [attachedFiles]);

  // Remove file
  const removeFile = (fileId) => {
    setAttachedFiles((prev) => {
      const updatedFiles = prev.filter((f) => {
        if (f.id === fileId) {
          // Revoke object URL to prevent memory leaks
          URL.revokeObjectURL(f.url);
          return false;
        }
        return true;
      });

      // Update editor height after removal
      setTimeout(() => {
        if (boxEditorRef.current) {
          setEditorHeight(boxEditorRef.current.offsetHeight);
        }
      }, 100);

      return updatedFiles;
    });
  };

  // Clear all files
  const clearAllFiles = () => {
    attachedFiles.forEach((file) => {
      URL.revokeObjectURL(file.url);
    });
    setAttachedFiles([]);
    setTimeout(() => {
      if (boxEditorRef.current) {
        setEditorHeight(boxEditorRef.current.offsetHeight);
      }
    }, 100);
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    // Auto-detect file type based on extension
    files.forEach((file) => {
      let detectedType = "document"; // default
      const extension = "." + file.name.split(".").pop().toLowerCase();

      for (const [type, config] of Object.entries(fileTypes)) {
        if (config.extensions.includes(extension)) {
          detectedType = type;
          break;
        }
      }

      handleFileSelect([file], detectedType);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return {
    attachedFiles,
    isDropdownOpen,
    setIsDropdownOpen,
    fileTypes,
    handleFileSelect,
    removeFile,
    clearAllFiles,
    handleDrop,
    handleDragOver,
  };
};

/**
 * File Type Selector - Dropdown for selecting file types
 */
const FileTypeSelector = ({ isOpen, onToggle, fileTypes, onFileSelect }) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useLayoutEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleFileInputChange = (e, type) => {
    if (e.target.files.length > 0) {
      onFileSelect(e.target.files, type);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className={`flex items-center justify-center h-10 w-10 rounded-xl cursor-pointer
                   transition-all duration-300 shadow-lg hover:shadow-xl 
                   transform hover:scale-105 hover:-translate-y-0.5
                   border backdrop-blur-sm group
                   ${
                     isOpen
                       ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white border-blue-400/50"
                       : "bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-600 hover:text-slate-700 border-slate-200/50"
                   }`}
        aria-label="File options"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-45" : "group-hover:scale-110"
          }`}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 left-0 min-w-[200px] bg-white/95 backdrop-blur-xl 
                        rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50
                        animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="p-2">
            {Object.entries(fileTypes).map(([type, config]) => (
              <div key={type} className="relative">
                <input
                  type="file"
                  id={`file-${type}`}
                  multiple
                  accept={config.accept}
                  className="hidden"
                  onChange={(e) => handleFileInputChange(e, type)}
                />
                <label
                  htmlFor={`file-${type}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
                           hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
                           transition-all duration-200 group"
                >
                  <span className="text-xl">{config.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-slate-700 group-hover:text-slate-800">
                      {config.label}
                    </div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-600">
                      {config.extensions.join(", ")}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * File Preview Item - Individual file preview with remove option
 */
const FilePreviewItem = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    const icons = {
      image: "🖼️",
      video: "🎬",
      document: "📄",
      audio: "🎵",
    };
    return icons[type] || "📎";
  };

  return (
    <div
      className="relative group bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/50
                    hover:bg-white/95 hover:border-white/70 transition-all duration-200
                    shadow-sm hover:shadow-md"
    >
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="absolute top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 
                   text-white rounded-full flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-all duration-200
                   transform scale-90 hover:scale-100 shadow-lg z-10"
        aria-label="Remove file"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      {/* File preview */}
      <div className="flex flex-col items-center gap-2">
        {file.type === "image" && file.preview ? (
          <ImageCustom
            width={0}
            height={0}
            src={file.preview}
            alt={file.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
        ) : file.type === "video" && file.preview ? (
          <video
            src={file.preview}
            className="w-12 h-12 object-cover rounded-lg"
            muted
          />
        ) : (
          <div
            className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 
                          rounded-lg flex items-center justify-center text-xl"
          >
            {getFileIcon(file.type)}
          </div>
        )}

        <div className="text-center">
          <div
            className="text-xs font-medium text-slate-700 truncate max-w-[80px]"
            title={file.name}
          >
            {file.name}
          </div>
          <div className="text-xs text-slate-500">
            {formatFileSize(file.size)}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * File Preview Container - Shows all attached files
 */
const FilePreview = ({ files, onRemoveFile, onClearAll }) => {
  if (files.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">
          Đã đính kèm ({files.length})
        </span>
        {files.length > 1 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-600 font-medium
                       px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-3 max-h-32 overflow-y-auto
                      scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 
                      hover:scrollbar-thumb-slate-400 pb-2"
      >
        {files.map((file) => (
          <FilePreviewItem key={file.id} file={file} onRemove={onRemoveFile} />
        ))}
      </div>
    </div>
  );
};

/**
 * Send Button Component - Modern 3D styled send/stop button
 */
const SendButton = ({ isDisabled, isStreaming, onClick }) => {
  const baseClasses = `
    flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-300
    shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5
    border backdrop-blur-sm font-medium text-sm
  `;

  const enabledClasses = isStreaming
    ? `${baseClasses} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
       text-white border-red-400/50 hover:border-red-500/70 shadow-red-500/25`
    : `${baseClasses} bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
       text-white border-blue-400/50 hover:border-purple-500/70 shadow-blue-500/25`;

  const disabledClasses = `${baseClasses} bg-gradient-to-br from-slate-200 to-slate-300 
                          text-slate-400 border-slate-300/50 cursor-not-allowed
                          transform-none hover:scale-100 hover:translate-y-0 shadow-sm`;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      aria-label={isStreaming ? "Stop streaming" : "Send message"}
      className={isDisabled ? disabledClasses : enabledClasses}
    >
      {isStreaming ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="transition-transform duration-200"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-200 group-hover:translate-y-[-1px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
};

/**
 * Editor Container Component - Wraps the custom editor with modern styling and drag-drop
 */
const EditorContainer = ({ children, onDrop, onDragOver }) => (
  <div
    className="group relative bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95
               backdrop-blur-xl rounded-2xl shadow-2xl hover:shadow-3xl
               border border-white/50 hover:border-white/70 transition-all duration-300
               transform hover:scale-[1.01] hover:-translate-y-0.5"
    onDrop={onDrop}
    onDragOver={onDragOver}
  >
    <div className="relative p-4 sm:p-5">{children}</div>

    {/* Decorative gradient overlay */}
    <div
      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    />
  </div>
);

/**
 * Main Chat Component - Enhanced with file dropdown and DataTransfer API
 */
const Chat = () => {
  // Hooks and state
  const { submitFormQuestion, editorRef, stopStream } = useContext(RosoContext);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const setEditorHeight = useUIStore.getState().setEditorHeight;
  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false); // Fix hydration

  // Refs
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const textareaRef = useRef(null); // Ref for hidden textarea

  // File management
  const {
    attachedFiles,
    isDropdownOpen,
    setIsDropdownOpen,
    fileTypes,
    handleFileSelect,
    removeFile,
    clearAllFiles,
    handleDrop,
    handleDragOver,
  } = useFileManager(setEditorHeight, containerRef);

  // Fix hydration error
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle content changes from editor
   */
  const handleContentChange = (content) => {
    setInputValue(content);
    // Update hidden textarea immediately
    if (textareaRef.current) {
      textareaRef.current.value = content;
    }
  };

  /**
   * Handle form submission from Enter key - chỉ submit, không stop
   */
  const handleSubmitFromEnter = () => {
    // Chỉ submit khi không đang streaming và có content
    if (isStreaming) return;

    const currentContent = editorRef.current?.getData() || "";

    setInputValue(currentContent);
    if (textareaRef.current) {
      textareaRef.current.value = currentContent;
    }

    setTimeout(() => {
      buttonRef.current?.click();
    }, 0);
  };

  /**
   * Handle button click - có thể submit hoặc stop
   */
  const handleButtonClick = () => {
    if (isStreaming) {
      // Stop streaming logic ở đây
      stopStream();
      return;
    }

    // Submit logic
    const currentContent = editorRef.current?.getData() || "";

    setInputValue(currentContent);
    if (textareaRef.current) {
      textareaRef.current.value = currentContent;
    }

    setTimeout(() => {
      buttonRef.current?.click();
    }, 0);
  };
  /**
   * Update editor height when content changes
   */
  useLayoutEffect(() => {
    if (containerRef.current) {
      const newHeight = containerRef.current.clientHeight; // 16px padding * 2
      // const newHeight = containerRef.current.clientHeight + 32; // 16px padding * 2
      setEditorHeight(newHeight);
    }
  }, [inputValue, attachedFiles, setEditorHeight]);

  // Button state logic
  const isButtonDisabled =
    inputValue.length <= 0 && attachedFiles.length <= 0 && !isStreaming;

  // Don't render until mounted (fix hydration)
  if (!isMounted) {
    return (
      <div className="relative">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="w-full">
              <div className="sticky bottom-4">
                <div
                  className="group relative bg-gradient-to-br from-white/95 via-white/90 to-slate-50/95
                               backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50"
                >
                  <div className="relative p-4 sm:p-5">
                    <div className="flex items-end gap-3 sm:gap-4">
                      <div className="flex-shrink-0 mb-1">
                        <div
                          className="flex items-center justify-center h-10 w-10 rounded-xl
                                       bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/50"
                        >
                          <div className="w-5 h-5 bg-slate-300 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
                      </div>
                      <div className="flex-shrink-0 mb-1">
                        <div
                          className="flex items-center justify-center h-10 w-10 rounded-xl
                                       bg-gradient-to-br from-slate-200 to-slate-300 border border-slate-300/50"
                        >
                          <div className="w-4 h-4 bg-slate-400 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="p-4 sm:p-6 lg:p-8">
        {/* Main form container */}
        <div className="w-full max-w-4xl mx-auto">
          <form className="w-full" action={submitFormQuestion}>
            <div className="sticky bottom-4">
              <EditorContainer onDrop={handleDrop} onDragOver={handleDragOver}>
                {/* File preview section */}
                <FilePreview
                  files={attachedFiles}
                  onRemoveFile={removeFile}
                  onClearAll={clearAllFiles}
                />

                {/* Input and controls section */}
                <div className="flex items-end gap-3 sm:gap-4">
                  {/* File selector dropdown */}
                  <div className="flex-shrink-0 mb-1">
                    <FileTypeSelector
                      isOpen={isDropdownOpen}
                      onToggle={setIsDropdownOpen}
                      fileTypes={fileTypes}
                      onFileSelect={handleFileSelect}
                    />
                  </div>

                  {/* Editor container */}
                  <div className="flex-1 min-w-0">
                    <div className="max-h-[25dvh] overflow-auto">
                      {/* Hidden textarea for form submission */}
                      <textarea
                        ref={textareaRef}
                        name="message"
                        hidden
                        value={inputValue}
                        onChange={() => {}} // Controlled by editor
                      />

                      {/* Hidden inputs for attached files */}
                      {attachedFiles.map((file, index) => (
                        <input
                          key={file.id}
                          type="hidden"
                          name={`file_${index}`}
                          value={JSON.stringify({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                          })}
                        />
                      ))}

                      {/* Custom editor */}
                      <CustomEditor
                        placeholder="Bạn muốn tôi giúp gì?"
                        ref={editorRef}
                        sendContent={handleContentChange}
                        handleSubmitFromEnter={handleSubmitFromEnter}
                      />
                    </div>
                  </div>

                  {/* Send button */}
                  <div className="flex-shrink-0 mb-1">
                    <SendButton
                      isDisabled={isButtonDisabled}
                      isStreaming={isStreaming}
                      onClick={handleButtonClick}
                    />

                    {/* Hidden submit button for form */}
                    <button
                      ref={buttonRef}
                      type="submit"
                      className="hidden"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </EditorContainer>
            </div>
          </form>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 
                        rounded-full mix-blend-multiply filter blur-xl animate-pulse"
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-yellow-600/20 
                        rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
};

export default Chat;