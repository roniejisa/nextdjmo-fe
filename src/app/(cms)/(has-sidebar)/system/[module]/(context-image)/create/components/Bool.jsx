"use client";
import { useEffect, useId, useRef, useState } from "react";
import Group from "./Group";
import style from "./Bool.module.scss";
const Bool = ({ field }) => {
  const [isTrue, setIsTrue] = useState(false);
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.value = isTrue ? "active" : "unactive";
  }, [isTrue]);
  const id = useId();
  return (
    <label
      className={`${style["switch-on-off"]}`}
      htmlFor={`${style["switch-on-off"]} ${id}`}
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
        onChange={() => setIsTrue(!isTrue)}
        defaultChecked={isTrue}
        id={`${style["switch-on-off"]} ${id}`}
      />
    </label>
  );
};

export default Bool;
