// GIAO DIỆN CHỈNH SỬA
"use client";
import { useEffect, useId, useRef, useState } from "react";
import style from "./Bool.module.scss";

const Bool = ({ value, field }) => {
  // Kiểm tra chính xác hơn
  const [isTrue, setIsTrue] = useState(value);
  const inputRef = useRef(null);
  const id = useId();
  const switchId = `switch-${id}`;

  useEffect(() => {
    const newIsTrue = value === "active";
    setIsTrue(newIsTrue);

    if (inputRef.current) {
      inputRef.current.checked = newIsTrue;
    }
  }, [value]);

  return (
    <label className={`${style["switch-on-off"]}`} htmlFor={switchId}>
      <input
        type="text"
        hidden
        name={field.name}
        ref={inputRef}
        value={isTrue ? "active" : "unactive"}
        readOnly
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
