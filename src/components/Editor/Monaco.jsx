"use client";
import Editor from "@monaco-editor/react";

const MonacoEditorCustom = ({
  value,
  lang = "javascript",
  theme = "vs-dark",
  className,
  ...props
}) => {
  return (
    <div className={className}>
      <Editor
        {...props}
        defaultLanguage={lang}
        defaultValue={value}
        theme={theme}
      />
    </div>
  );
};

export default MonacoEditorCustom;
