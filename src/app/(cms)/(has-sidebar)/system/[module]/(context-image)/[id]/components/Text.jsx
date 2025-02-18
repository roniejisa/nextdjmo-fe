"use client";

import { useEffect } from "react";

const Text = ({ defaultValue, field, oldData }) => {
  useEffect(() => {
    document.querySelector(`input[name="${field.name}"]`).value =
      defaultValue || oldData[field.name] || "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, oldData]);
  return (
    <input
      defaultValue={defaultValue || oldData[field.name] || ""}
      name={field.name}
      autoComplete="off"
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Text;
