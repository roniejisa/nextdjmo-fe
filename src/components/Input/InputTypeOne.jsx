"use client";

import { useState } from "react";

const InputTypeOne = ({ name, placeholder, defaultValue, type = "text" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const checkFocus = () => {
    setIsFocused(true);
  };

  const checkBlur = (e) => {
    if (e.target.value === "") {
      setHasValue(false);
    } else {
      setHasValue(true);
    }
    setIsFocused(false);
  };
  return (
    <div className="relative mb-4">
      <div>
        <input
          autoComplete="off"
          type={type}
          className={`w-full pt-6 pb-2 outline-[#2a85ff] font-bold px-3 rounded-2xl ${
            hasValue && !isFocused ? "bg-white" : ""
          } ${!hasValue && !isFocused ? "bg-[#f5f5f5]" : ""}`}
          name={name}
          defaultValue={defaultValue || ""}
          onFocus={checkFocus}
          onBlur={checkBlur}
        />
        <label
          className={`absolute transition text-[#666666] text-sm font-bold left-3 ${
            isFocused || hasValue
              ? "text-xs top-1"
              : "top-[50%] translate-y-[-50%]"
          }`}
        >
          {placeholder.toUpperCase()}
        </label>
      </div>
    </div>
  );
};

export default InputTypeOne;
