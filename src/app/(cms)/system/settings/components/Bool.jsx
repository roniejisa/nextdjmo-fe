"use client";
import { useEffect, useRef, useState } from "react";
import style from "./Bool.module.scss";
const Bool = ({ defaultValue, field }) => {
  const [isTrue, setIsTrue] = useState(defaultValue == "active" ? true : false);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.value = isTrue ? "active" : "unactive";
  }, [isTrue]);

  return (
    <label
      className={`${style["switch-on-off"]}`}
      htmlFor={`${style["switch-on-off"]}`}
    >
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
        defaultChecked={isTrue}
        id={`${style["switch-on-off"]}`}
      />
    </label>
  );
};

export default Bool;
