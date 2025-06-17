"use client";
import MonacoEditorCustom from "@/components/Editor/Monaco";
import React, { useEffect, useRef, useState } from "react";

const CodeEditor = ({ field, value: initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current.value = value;
  }, [value]);
  return (
    <>
      <textarea
        ref={textareaRef}
        value={value}
        name={field.name}
        hidden={true}
      ></textarea>
      <MonacoEditorCustom
        onChange={(e) => setValue(e)}
        className={`h-[${field.height || 500}px]`}
        value={value}
        lang={field.lang || "html"}
      />
    </>
  );
};

export default CodeEditor;
