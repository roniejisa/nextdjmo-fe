// base/FieldLabel.jsx
import React from "react";
import { STYLES } from "../constants/styles";

const FieldLabel = ({ icon, label, required, size = "normal" }) => {
  return (
    <label className={size === "small" ? STYLES.subLabel : STYLES.label}>
      <div className="flex items-center gap-2">
        {label}
        {required && (
          <span
            className={
              size === "small" ? STYLES.requiredInline : STYLES.required
            }
          >
            *
          </span>
        )}
      </div>
    </label>
  );
};

export default FieldLabel;
