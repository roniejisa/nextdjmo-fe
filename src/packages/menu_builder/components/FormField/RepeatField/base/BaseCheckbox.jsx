// base/BaseCheckbox.jsx
import React from "react";
import { STYLES } from "../constants/styles";

const BaseCheckbox = ({
  checked,
  onChange,
  label,
  icon: Icon,
  required,
  size = "normal",
}) => (
  <label
    className={`flex items-${size === "small" ? "center" : "start"} gap-${
      size === "small" ? "2" : "3"
    } text-sm font-medium text-gray-700 cursor-pointer group`}
  >
    <input
      type="checkbox"
      checked={checked || false}
      onChange={(e) => onChange(e.target.checked)}
      className={size === "small" ? STYLES.checkboxSmall : STYLES.checkbox}
    />
    <div className="flex items-center gap-2 flex-1">
      <Icon
        className={`${size === "small" ? "w-4 h-4" : "w-4 h-4"} text-blue-600`}
      />
      <span className="text-gray-700">{label}</span>
      {required && <span className={STYLES.requiredInline}>*</span>}
    </div>
  </label>
);

export default BaseCheckbox;