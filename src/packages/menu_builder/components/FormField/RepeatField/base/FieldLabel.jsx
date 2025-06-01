// base/FieldLabel.jsx
import React from "react";
import { STYLES } from "../constants/styles";
import * as lucideReact from "lucide-react";

const FieldLabel = ({ icon, label, required, size = "normal" }) => {
  const IconComponent =
    (typeof icon == "string" ? icon : lucideReact?.[icon]) ?? lucideReact.Type;
  return (
    <label className={size === "small" ? STYLES.subLabel : STYLES.label}>
      <div className="flex items-center gap-2">
        {icon &&
          (IconComponent === "string" ? (
            <span className={size === "small" ? "text-xs" : "text-sm"}>
              {IconComponent}
            </span>
          ) : (
            <IconComponent
              className={`${
                size === "small" ? "w-3 h-3" : "w-4 h-4"
              } text-blue-600`}
            />
          ))}
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
