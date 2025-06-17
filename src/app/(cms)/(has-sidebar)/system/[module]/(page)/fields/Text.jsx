"use client";

import { useEffect } from "react";

const Text = ({ value, field, item }) => {
  useEffect(() => {
    document.querySelector(`input[name="${field.name}"]`).value =
      value ?? item?.[field.name] ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, item]);
  return (
    <input
      defaultValue={value ?? item?.[field.name] ?? ""}
      name={field.name}
      autoComplete="off"
      placeholder={field.placeholder}
      className="w-full outline-outline outline-4 transition border rounded-md p-2"
    />
  );
};

export default Text;
