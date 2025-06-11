// components/RepeatSubField.jsx
import React from "react";
import FieldLabel from "../base/FieldLabel";
import SmallInput from "../base/SmallInput";
import SmallTextarea from "../base/SmallTextarea";
import BaseSelect from "../base/BaseSelect";
import BaseCheckbox from "../base/BaseCheckbox";
import ImageField from "../../../ImageField";

const RepeatSubField = ({ field, value, onChange, index, parentKey }) => {
  const handleChange = (newValue) => {
    onChange(index, field.key, newValue);
  };

  const commonProps = {
    value: value[field.key],
    onChange: handleChange,
    placeholder: field.placeholder,
  };

  const fieldComponents = {
    checkbox: () => (
      <BaseCheckbox
        checked={value[field.key]}
        onChange={handleChange}
        label={field.label}
        icon={field.icon}
        required={field.required}
        size="small"
      />
    ),
    select: () => (
      <div>
        <FieldLabel
          icon={field.icon}
          label={field.label}
          required={field.required}
          size="small"
        />
        <BaseSelect {...commonProps} options={field.options} size="small" />
      </div>
    ),
    textarea: () => {
      return (
        <div>
          <FieldLabel
            icon={field.icon}
            label={field.label}
            required={field.required}
            size="small"
          />
          <SmallTextarea {...commonProps} />
        </div>
      );
    },
    image: () => (
      <div className="space-y-3">
        <ImageField {...commonProps} />
      </div>
    ),
    default: () => (
      <div>
        <FieldLabel
          icon={field.icon}
          label={field.label}
          required={field.required}
          size="small"
        />
        <SmallInput type={field.type || "text"} {...commonProps} />
      </div>
    ),
  };
  
  const isFunction = typeof fieldComponents[field.type] === 'function'
  return isFunction ? fieldComponents[field.type]() : fieldComponents.default();
};

export default RepeatSubField;
