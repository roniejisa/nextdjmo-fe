import React, { useState } from "react";
import {
  Settings,
  Plus,
} from "lucide-react";
import { fieldTypes } from "../constants";
import SchemaField from "./SchemaField";

const SchemaConfiguration = ({
  menuSchema = [],
  onUpdateSchema,
  onRemoveField,
  onAddField,
  canRemoveField = true,
}) => {
  const [editingSchemaField, setEditingSchemaField] = useState(null);
  const [newField, setNewField] = useState({
    key: "",
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    defaultValue: "",
    options: "",
  });

  const handleAddField = () => {
    if (!newField.key || !newField.label) return;

    const fieldConfig = {
      ...newField,
      icon: fieldTypes.find((t) => t.value === newField.type)?.icon || "Type",
      options:
        newField.type === "select"
          ? newField.options
              .split(",")
              .map((o) => o.trim())
              .filter((o) => o)
          : undefined,
    };

    onAddField(fieldConfig);
    
    // Reset form
    setNewField({
      key: "",
      label: "",
      type: "text",
      required: false,
      placeholder: "",
      defaultValue: "",
      options: "",
    });
  };

  const handleUpdateField = (index, updates) => {
    onUpdateSchema(index, updates);
  };

  const handleRemoveField = (key) => {
    if (menuSchema.length <= 1) {
      alert("Phải có ít nhất một trường trong schema!");
      return;
    }
    onRemoveField(key);
  };

  const renderSchemaField = (field, index) => {
    return (
      <SchemaField
        key={index}
        field={field}
        index={index}
        isEditing={editingSchemaField === index}
        onStartEdit={() => setEditingSchemaField(index)}
        onUpdate={(updates) => handleUpdateField(index, updates)}
        onStopEdit={() => setEditingSchemaField(null)}
        onRemove={() => handleRemoveField(field.key)}
        canRemove={canRemoveField && menuSchema.length > 1}
      />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Schema Configuration
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Định nghĩa các trường dữ liệu cho menu
        </p>
      </div>

      <div className="p-6">
        {/* Existing Schema Fields */}
        <div className="space-y-4 mb-6">
          {menuSchema.map((field, index) =>
            renderSchemaField(field, index)
          )}
        </div>

        {/* Add New Field Form */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Thêm trường mới
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Key (ex: image)"
                value={newField.key}
                onChange={(e) =>
                  setNewField({ ...newField, key: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Label (vd: Ảnh)"
                value={newField.label}
                onChange={(e) =>
                  setNewField({ ...newField, label: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={newField.type}
              onChange={(e) =>
                setNewField({ ...newField, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {fieldTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Placeholder text"
              value={newField.placeholder}
              onChange={(e) =>
                setNewField({
                  ...newField,
                  placeholder: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {newField.type === "select" && (
              <input
                type="text"
                placeholder="Options (phân cách bằng dấu phẩy)"
                value={newField.options}
                onChange={(e) =>
                  setNewField({ ...newField, options: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newField.required}
                onChange={(e) =>
                  setNewField({
                    ...newField,
                    required: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Required field
              </span>
            </label>

            <button
              onClick={handleAddField}
              disabled={!newField.key || !newField.label}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm trường
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaConfiguration;