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
          type={type}
          className={`w-full rounded-none pt-6 pb-2 font-bold px-3 ${
            hasValue && !isFocused ? "bg-[#F5F5F5]" : ""
          } ${!hasValue && !isFocused ? "bg-[#f8f8f8]" : ""}`}
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
