// base/SmallInput.jsx
import React from "react";
import { STYLES } from "../constants/styles";

const SmallInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className={`${STYLES.inputSmall} ${className}`}
    placeholder={placeholder}
    {...props}
  />
);

export default SmallInput;