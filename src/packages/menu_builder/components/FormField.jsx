import { ChevronDown, Link } from "lucide-react";
import React from "react";
import RepeatField, { FieldLabel, STYLES } from "./FormField/RepeatField";
import ImageField from "./ImageField";
import * as lucideReact from "lucide-react";

// ========================= BASE COMPONENTS =========================

const InputWithIcon = ({ icon: Icon, children, iconPosition = "left" }) => {
  const IconComponent =
    (typeof Icon == "string" ? Icon : lucideReact?.[Icon]) ?? lucideReact.Type;
  return (
    <div className="relative">
      {children}
      {IconComponent && (
        <IconComponent
          className={`absolute ${
            iconPosition === "left" ? "left-3" : "right-3"
          } top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
            iconPosition === "right" ? "pointer-events-none" : ""
          }`}
        />
      )}
    </div>
  );
};

const BaseInput = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  hasIcon = false,
  ...props
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className={`${STYLES.input} ${
      hasIcon ? STYLES.inputWithIcon : ""
    } ${className}`}
    placeholder={placeholder}
    {...props}
  />
);

const BaseTextarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  ...props
}) => (
  <textarea
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className={`${STYLES.input} ${STYLES.textarea} ${className}`}
    placeholder={placeholder}
    rows={rows}
    {...props}
  />
);

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

// ========================= FIELD RENDERERS =========================

const renderSimpleField = (field, formData, updateFormData) => {
  const commonProps = {
    field: field,
    value: formData[field.key],
    onChange: (value) => updateFormData(field.key, value),
    placeholder: field.placeholder,
  };

  const fieldRenderers = {
    textarea: () => <BaseTextarea {...commonProps} />,

    select: () => <BaseSelect {...commonProps} options={field.options} />,

    checkbox: () => (
      <BaseCheckbox
        checked={formData[field.key]}
        onChange={(value) => updateFormData(field.key, value)}
        label={field.label}
        icon={field.icon}
        required={field.required}
      />
    ),

    url: () => {
      return (
        <InputWithIcon icon={"Link"}>
          <BaseInput type="text" {...commonProps} hasIcon />
        </InputWithIcon>
      );
    },

    image: () => (
      <div className="space-y-3">
        <ImageField {...commonProps} />
      </div>
    ),

    number: () => (
      <InputWithIcon icon={"Hash"}>
        <BaseInput type="number" {...commonProps} hasIcon />
      </InputWithIcon>
    ),

    date: () => (
      <InputWithIcon icon={"Calendar"}>
        <BaseInput type="date" {...commonProps} hasIcon />
      </InputWithIcon>
    ),

    default: () => (
      <InputWithIcon icon={"Type"}>
        <BaseInput type={field.type} {...commonProps} hasIcon />
      </InputWithIcon>
    ),
  };
  return fieldRenderers?.[field.type]?.() || fieldRenderers.default();
};

// ========================= MAIN EXPORT =========================

export const renderFormField = (field, setFormData, formData) => {
  const updateFormData = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  if (field.type === "repeat") {
    return (
      <RepeatField
        key={field.key}
        field={field}
        formData={formData}
        updateFormData={updateFormData}
      />
    );
  }

  return (
    <div key={field.key} className="space-y-2">
      {field.type !== "checkbox" && (
        <FieldLabel
          icon={field.icon}
          label={field.label}
          required={field.required}
        />
      )}
      {renderSimpleField(field, formData, updateFormData)}
    </div>
  );
};
