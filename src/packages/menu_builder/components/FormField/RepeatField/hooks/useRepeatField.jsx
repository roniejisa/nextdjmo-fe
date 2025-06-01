// hooks/useRepeatField.js
import { useState } from "react";
import { createEmptyItem } from "../utils/createEmptyItem";
import { validateSelectedFields } from "../utils/validateFields";
import { processSelectedFields } from "../utils/processFields";

export const useRepeatField = (field, formData, updateFormData) => {
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const currentData = formData[field.key] || [];

  // Initialize field schema if not exists
  if (!field.fields) {
    field.fields = [];
  }

  const handlers = {
    addItem: () => {
      const newItem = createEmptyItem(field.fields);
      updateFormData(field.key, [...currentData, newItem]);
    },

    updateItem: (index, subKey, value) => {
      const newData = [...currentData];
      newData[index] = { ...newData[index], [subKey]: value };
      updateFormData(field.key, newData);
    },

    copyItem: (index) => {
      const newItem = { ...currentData[index] };
      updateFormData(field.key, [...currentData, newItem]);
    },

    removeItem: (index) => {
      const newData = currentData.filter((_, i) => i !== index);
      updateFormData(field.key, newData);
    },

    selectFieldType: (fieldType) => {
      setSelectedFields([
        ...selectedFields,
        {
          type: fieldType.type,
          label: fieldType.label,
          key: "",
          customLabel: "",
          options: fieldType.type === "select" ? "" : undefined,
          _id: Date.now() + Math.random(),
        },
      ]);
    },

    updateSelectedField: (index, updates) => {
      const newSelectedFields = [...selectedFields];
      newSelectedFields[index] = { ...newSelectedFields[index], ...updates };
      setSelectedFields(newSelectedFields);
    },

    removeSelectedField: (index) => {
      setSelectedFields(selectedFields.filter((_, i) => i !== index));
    },

    saveFieldsToSchema: () => {
      const errors = validateSelectedFields(selectedFields, field.fields);

      if (errors.length > 0) {
        alert("Có lỗi:\n" + errors.join("\n"));
        return;
      }

      const newFields = processSelectedFields(selectedFields);
      field.fields = [...field.fields, ...newFields];

      // Update all existing items with new fields
      const updatedData = currentData.map((item) => {
        const newItem = { ...item };
        newFields.forEach((newField) => {
          newItem[newField.key] = newField.type === "checkbox" ? false : "";
        });
        return newItem;
      });

      updateFormData(field.key, updatedData);
      setSelectedFields([]);
      setShowAddFieldModal(false);
    },

    removeFieldFromSchema: (fieldKey) => {
      if (
        confirm(
          `Bạn có chắc muốn xóa field "${fieldKey}" khỏi schema? Dữ liệu của field này sẽ bị mất!`
        )
      ) {
        field.fields = field.fields.filter((f) => f.key !== fieldKey);
        const updatedData = currentData.map((item) => {
          const newItem = { ...item };
          delete newItem[fieldKey];
          return newItem;
        });
        updateFormData(field.key, updatedData);
      }
    },

    closeModal: () => {
      setShowAddFieldModal(false);
      setSelectedFields([]);
    },
  };

  return {
    currentData,
    showAddFieldModal,
    selectedFields,
    setShowAddFieldModal,
    handlers,
  };
};