"use client";
import { useEffect, useId, useRef, useState } from "react";
import style from "./Bool.module.scss";

const Bool = ({ defaultValue, field }) => {
  console.log("defaultValue:", defaultValue, "type:", typeof defaultValue);

  // Kiểm tra chính xác hơn
  const [isTrue, setIsTrue] = useState(() => {
    if (typeof defaultValue === "string") {
      return defaultValue.trim().toLowerCase() === "active";
    }
    return Boolean(defaultValue);
  });

  const inputRef = useRef(null);
  const id = useId();
  const switchId = `switch-${id}`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = isTrue ? "active" : "unactive";
    }
  }, [isTrue]);

  return (
    <label className={`${style["switch-on-off"]}`} htmlFor={switchId}>
      <input
        type="text"
        hidden
        name={field.name}
        ref={inputRef}
        defaultValue={isTrue ? "active" : "unactive"}
      />
      <input
        type="checkbox"
        placeholder={field.placeholder}
        onChange={() => setIsTrue(!isTrue)}
        checked={isTrue} // Dùng checked thay vì defaultChecked để controlled
        id={switchId}
      />
    </label>
  );
};

export default Bool;
