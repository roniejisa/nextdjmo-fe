"use client"
import MonacoEditorCustom from "@/components/Editor/Monaco";
import React, { useEffect, useRef, useState } from "react";

const CodeEditor = ({ field, defaultValue }) => {
  const [value, setValue] = useState(null);
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current.value = value;
  }, [value]);
  return (
    <>
      <textarea
        ref={textareaRef}
        defaultValue={defaultValue}
        name={field.name}
        hidden={true}
      ></textarea>
      <MonacoEditorCustom
        onChange={(e) => setValue(e)}
        className={`h-[${field.height || 500}px]`}
        defaultValue={defaultValue}
        lang={field.lang || "html"}
      />
    </>
  );
};

export default CodeEditor;
