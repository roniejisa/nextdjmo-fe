import React from "react";
import * as lucideReact from "lucide-react";
import { fieldTypes } from "../constants";

const SchemaField = ({
  field,
  index,
  isEditing,
  onStartEdit,
  onUpdate,
  onStopEdit,
  onRemove,
  canRemove = true,
}) => {
  const IconComponent = lucideReact?.[field?.icon] ?? lucideReact.Type;
  if (isEditing) {
    return (
      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              type="text"
              value={field.key}
              onChange={(e) => onUpdate({ key: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={field.type}
              onChange={(e) =>
                onUpdate({
                  type: e.target.value,
                  icon:
                    fieldTypes.find((t) => t.value === e.target.value)?.icon ||
                    Type,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {field.type === "select" && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={field.options?.join(", ") || ""}
                onChange={(e) =>
                  onUpdate({
                    options: e.target.value
                      .split(",")
                      .map((o) => o.trim())
                      .filter((o) => o),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Required
              </span>
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={onStopEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lưu
          </button>
          <button
            onClick={onStopEdit}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-3">
        <IconComponent className="w-5 h-5 text-gray-600" />
        <div>
          <div className="font-medium text-gray-900">{field.label}</div>
          <div className="text-sm text-gray-500">
            {field.key} ({field.type})
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onStartEdit}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
          title="Chỉnh sửa"
        >
          <lucideReact.Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          title="Xóa"
          disabled={!canRemove}
        >
          <lucideReact.Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SchemaField;
