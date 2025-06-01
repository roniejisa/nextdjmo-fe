// components/FieldTypeSelector.jsx
import React from "react";
import { FIELD_TYPES } from "../constants/fieldTypes";

const FieldTypeSelector = ({ onSelectFieldType }) => (
  <div className="mb-6">
    <h4 className="text-sm font-medium mb-3">
      Chọn loại field (có thể chọn cùng 1 loại nhiều lần):
    </h4>
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {FIELD_TYPES.map((fieldType) => (
        <button
          key={fieldType.type}
          type="button"
          onClick={() => onSelectFieldType(fieldType)}
          className="p-3 rounded-lg border text-center text-xs transition-colors bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        >
          <div className="text-lg mb-1">{fieldType.icon}</div>
          <div className="font-medium">{fieldType.label}</div>
          <div className="text-gray-500">{fieldType.type}</div>
        </button>
      ))}
    </div>
  </div>
);

export default FieldTypeSelector;