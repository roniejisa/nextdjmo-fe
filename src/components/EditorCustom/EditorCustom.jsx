/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import debounce from "lodash/debounce";

/**
 * Editor Input Component - Clean contentEditable without duplicate styling
 */
const EditorInput = ({
  editorRef,
  placeholder,
  onKeyDown,
  onKeyUp,
  onPaste,
  isEmpty,
  className,
}) => {
  const baseClasses = `
    w-full min-h-[2.5rem] p-3 sm:p-4 
    text-sm sm:text-base leading-relaxed
    bg-transparent border-0 outline-none resize-none
    text-slate-700 placeholder:text-slate-400
    transition-all duration-200 ease-in-out
  `;

  return (
    <div className="relative group">
      {/* Editor input */}
      <div
        ref={editorRef}
        contentEditable="true"
        className={`${baseClasses} ${className || ""}`}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onPaste={onPaste}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        data-placeholder={placeholder}
        suppressContentEditableWarning
        style={{
          minHeight: "2.5rem",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      />

      {/* Floating placeholder */}
      {isEmpty && (
        <div
          className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none
                        text-slate-400 text-sm sm:text-base transition-all duration-200
                        group-focus-within:text-slate-300 group-focus-within:scale-95
                        group-focus-within:-translate-y-0.5 select-none"
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

/**
 * Editor Container Component - Simple wrapper without duplicate styles
 */
const EditorContainer = ({ children }) => (
  <div className="relative">{children}</div>
);

/**
 * Character Counter Component - Shows character count with modern styling
 */
const CharacterCounter = ({ count, maxLength = null }) => {
  if (count === 0) return null;

  const isNearLimit = maxLength && count > maxLength * 0.8;
  const isOverLimit = maxLength && count > maxLength;

  return (
    <div className="absolute bottom-2 right-2 z-20">
      <div
        className={`
        px-2 py-1 rounded-md text-xs font-medium
        backdrop-blur-sm border transition-all duration-200
        ${
          isOverLimit
            ? "bg-red-500/90 text-white border-red-400/50"
            : isNearLimit
            ? "bg-amber-500/90 text-white border-amber-400/50"
            : "bg-slate-500/80 text-white border-slate-400/50"
        }
      `}
      >
        {count}
        {maxLength && `/${maxLength}`}
      </div>
    </div>
  );
};

/**
 * Main CustomEditor Component - Fixed fast typing issue
 */
const CustomEditor = forwardRef(function CustomEditor(
  {
    placeholder = "Question for me?",
    sendContent,
    handleSubmitFromEnter,
    className = "",
    maxLength = null,
    showCharCount = false,
  },
  ref
) {
  // Refs and state
  const editorRef = useRef(null);
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Debounced content sender to limit frequent calls
  const debouncedSendContent = useCallback(
    debounce((text) => {
      sendContent(text);
    }, 300),
    [sendContent]
  );

  const cancelDebounce = useCallback(() => {
    debouncedSendContent.cancel();
  }, [debouncedSendContent]);

  /**
   * Get clean text content from editor
   */
  const getText = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return "";

    const text = editor.innerText.trim();

    // Clean up empty states
    if (editor.innerHTML === "<br>" || text.length === 0) {
      editor.innerHTML = "";
    }

    return editor.innerText.trim();
  }, []);

  /**
   * Imperative handle for parent component access
   */
  useImperativeHandle(
    ref,
    () => ({
      clearData() {
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
          setContent("");
          setCharCount(0);
          debouncedSendContent("");
        }
      },
      getData() {
        return getText();
      },
      focus() {
        editorRef.current?.focus();
      },
    }),
    [debouncedSendContent, getText]
  );

  /**
   * Handle keyboard shortcuts and enter key
   */
  const handleKeyDown = useCallback(
    (e) => {
      // Submit on Enter (without Shift)
      if (!e.shiftKey && e.code === "Enter") {
        e.preventDefault();

        // Cancel debounce để tránh conflict
        cancelDebounce();

        setTimeout(() => {
          const currentText = getText();
          setContent(currentText);
          sendContent(currentText);

          setTimeout(() => {
            handleSubmitFromEnter();
          }, 10);
        }, 0);
        return;
      }

      // Prevent common formatting shortcuts
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (["b", "i", "u", "s", "k"].includes(key)) {
          e.preventDefault();
        }
      }
    },
    [handleSubmitFromEnter, getText, sendContent]
  );

  /**
   * Handle content changes
   */
  const handleKeyUp = useCallback(() => {
    const text = getText();
    const count = text.length;

    setContent(text);
    setCharCount(count);
    debouncedSendContent(text);
  }, [debouncedSendContent, getText]);

  /**
   * Handle paste operations with image support
   */
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      let text = clipboardData.getData("text");

      // Handle image pasting
      for (const item of clipboardData.items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          const imgURL = URL.createObjectURL(blob);

          // Insert image into editor
          if (document.execCommand) {
            document.execCommand(
              "insertHTML",
              false,
              `<img src="${imgURL}" style="max-width:300px; border-radius: 8px; margin: 4px 0;" />`
            );
          }
        }
      }

      // Insert text content
      if (text) {
        if (document.execCommand) {
          document.execCommand("insertText", false, text);
        } else {
          // Fallback for browsers that don't support execCommand
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
      }

      // Update state after paste
      const updatedText = getText();
      const count = updatedText.length;

      setContent(updatedText);
      setCharCount(count);
      debouncedSendContent(updatedText);
    },
    [debouncedSendContent, getText]
  );

  // Check if editor is empty
  const isEmpty = content.length === 0;

  return (
    <div className="relative w-full">
      <EditorContainer>
        <EditorInput
          editorRef={editorRef}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          isEmpty={isEmpty}
          className={className}
        />

        {/* Character counter */}
        {showCharCount && (
          <CharacterCounter count={charCount} maxLength={maxLength} />
        )}
      </EditorContainer>

      {/* Mobile optimization styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          [contenteditable] {
            font-size: 16px !important; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </div>
  );
});

export default CustomEditor;
