// GIAO DIỆN QUẢN LÝ DANH SÁCH
"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import style from "./Bool.module.scss";
import { changeFieldBool } from "../actions";
import { useNotify } from "@/context/NotifyProvider";
import { debounce } from "@/hooks/useDebounce";
const Bool = ({ field, value, module, item }) => {
  const idOther = useId();
  const [isTrue, setIsTrue] = useState(value == "active");
  const inputRef = useRef();
  const notify = useNotify();

  useEffect(() => {
    const newIsTrue = value === "active";
    setIsTrue(newIsTrue);

  // Cập nhật checkbox DOM element
    if (inputRef.current) {
      inputRef.current.checked = newIsTrue;
    }
  }, [value]);

  const changeStatusOrder = async (value) => {
    const response = await changeFieldBool(
      module,
      field.name,
      item._id,
      value ? "active" : "unactive"
    );

    if (response && response.status == 200) {
      notify.changeNotify("success", response.message);
    }
  };

  const handleChange = (event) => {
    const value = event.target.checked;
    setIsTrue(value == "active" ? true : false);
    changeStatusOrder(value);
  };

  return (
    <label
      className={`${style["switch-on-off"]}`}
      htmlFor={`${style["switch-on-off"]} ${idOther}`}
    >
      <input
        type="checkbox"
        ref={inputRef}
        placeholder={field.placeholder}
        defaultChecked={isTrue}
        onChange={debounce(handleChange, 1000)}
        id={`${style["switch-on-off"]} ${idOther}`}
      />
    </label>
  );
};

export default Bool;
