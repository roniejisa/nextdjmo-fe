"use client";

import { useEffect, useRef } from "react";

const Textarea = ({ value, field, item }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    textareaRef.current.value = value ?? "";
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      name={field.name}
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    ></textarea>
  );
};

export default Textarea;
