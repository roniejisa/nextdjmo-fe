// components/SelectedFieldsConfig.jsx
import React from "react";
import { FIELD_TYPES } from "../constants/fieldTypes";

const SelectedFieldsConfiguration = ({
  selectedFields,
  onUpdateField,
  onRemoveField,
}) => {
  if (!selectedFields.length) return null;

  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3">Cấu hình fields đã chọn:</h4>
      <div className="space-y-4">
        {selectedFields.map((field, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">
                {FIELD_TYPES.find((t) => t.type === field.type)?.icon}
              </span>
              <span className="font-medium">{field.type}</span>
              <button
                type="button"
                onClick={() => onRemoveField(index)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Key (tên field trong JSON) *
                </label>
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) =>
                    onUpdateField(index, { key: e.target.value })
                  }
                  placeholder="vd: url, title, content..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Label (hiển thị) *
                </label>
                <input
                  type="text"
                  value={field.customLabel}
                  onChange={(e) =>
                    onUpdateField(index, { customLabel: e.target.value })
                  }
                  placeholder="vd: Đường dẫn, Tiêu đề, Nội dung..."
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>

              {field.type === "select" && (
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Options (phân cách bằng dấu phẩy) *
                  </label>
                  <input
                    type="text"
                    value={field.options}
                    onChange={(e) =>
                      onUpdateField(index, { options: e.target.value })
                    }
                    placeholder="vd: active, inactive, draft"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedFieldsConfiguration;