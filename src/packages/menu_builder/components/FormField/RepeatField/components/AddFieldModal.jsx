// components/AddFieldModal.jsx
import React from "react";
import FieldTypeSelector from "./FieldTypeSelector";
import SelectedFieldsConfiguration from "./SelectedFieldsConfig";

const AddFieldModal = ({
  showModal,
  selectedFields,
  onClose,
  onSelectFieldType,
  onUpdateSelectedField,
  onRemoveSelectedField,
  onSave,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Thêm Fields vào Schema</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <FieldTypeSelector onSelectFieldType={onSelectFieldType} />

        <SelectedFieldsConfiguration
          selectedFields={selectedFields}
          onUpdateField={onUpdateSelectedField}
          onRemoveField={onRemoveSelectedField}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Đã chọn {selectedFields.length} field(s)
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={onSave}
              disabled={selectedFields.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Lưu Fields
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFieldModal;