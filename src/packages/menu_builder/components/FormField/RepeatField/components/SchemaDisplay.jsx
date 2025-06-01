// components/SchemaDisplay.jsx
import React from "react";

const SchemaDisplay = ({ fields, onRemoveField }) => {
  if (!fields?.length) return null;

  return (
    <div className="bg-blue-50 p-3 rounded-lg">
      <h4 className="text-sm font-medium text-blue-800 mb-2">
        Schema hiện tại:
      </h4>
      <div className="flex flex-wrap gap-2">
        {fields.map((schemaField) => (
          <div
            key={schemaField.key}
            className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-xs"
          >
            <span className="font-medium">{schemaField.key}</span>
            <span className="text-blue-600">({schemaField.type})</span>
            <button
              type="button"
              onClick={() => onRemoveField(schemaField.key)}
              className="ml-1 text-red-500 hover:text-red-700"
              title="Xóa field khỏi schema"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaDisplay;