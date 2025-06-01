// base/BaseSelect.jsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { STYLES } from "../constants/styles";

const BaseSelect = ({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  className = "",
  size = "normal",
}) => (
  <div className="relative">
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`${size === "small" ? STYLES.inputSmall : STYLES.input} ${
        STYLES.select
      } ${className}`}
    >
      <option value="">{placeholder}</option>
      {options?.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown
      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
        size === "small" ? "w-3 h-3" : "w-4 h-4"
      } text-gray-400 pointer-events-none`}
    />
  </div>
);

export default BaseSelect;