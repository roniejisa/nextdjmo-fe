// base/SmallTextarea.jsx
import React from "react";
import { STYLES } from "../constants/styles";

const SmallTextarea = ({ value, onChange, placeholder, rows = 2 }) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className={`${STYLES.inputSmall} ${STYLES.textareaSmall}`}
    placeholder={placeholder}
    rows={rows}
  />
);

export default SmallTextarea;