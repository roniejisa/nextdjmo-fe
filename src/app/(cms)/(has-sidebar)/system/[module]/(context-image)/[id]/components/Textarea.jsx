"use client";

import { useEffect } from "react";

const Textarea = ({ defaultValue, field, oldData }) => {
  useEffect(() => {
    document.querySelector(`textarea[name="${field.name}"]`).value =
      defaultValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
  return (
    <textarea
      defaultValue={defaultValue || oldData[field.name] || ""}
      name={field.name}
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    ></textarea>
  );
};

export default Textarea;
