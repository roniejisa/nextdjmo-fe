"use client";
import { useId, useRef, useState } from "react";
import style from "./Bool.module.scss";
const Bool = ({ field, value }) => {
  const idOther = useId();
  const [isTrue, setIsTrue] = useState(value == "active" ? true : false);
  const checkboxRef = useRef();

  return (
    <label
      className={`${style["switch-on-off"]}`}
      htmlFor={`${style["switch-on-off"]} ${idOther}`}
    >
      <input
        type="checkbox"
        placeholder={field.placeholder}
        defaultChecked={isTrue}
        id={`${style["switch-on-off"]} ${idOther}`}
      />
    </label>
  );
};

export default Bool;
