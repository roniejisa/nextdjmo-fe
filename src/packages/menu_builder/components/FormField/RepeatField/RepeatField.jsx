// RepeatField.jsx
import React from "react";
import { Plus } from "lucide-react";
import { STYLES } from "./constants/styles";
import { useRepeatField } from "./hooks/useRepeatField";
import FieldLabel from "./base/FieldLabel";
import SchemaDisplay from "./components/SchemaDisplay";
import AddFieldModal from "./components/AddFieldModal";
import RepeatFieldItem from "./components/RepeatFieldItem";
import EmptyRepeatState from "./components/EmptyRepeatState";

const RepeatField = ({ field, formData, updateFormData }) => {
  const {
    currentData,
    showAddFieldModal,
    selectedFields,
    setShowAddFieldModal,
    handlers,
  } = useRepeatField(field, formData, updateFormData);

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
      <div className="flex items-center justify-between">
        <FieldLabel
          icon={field.icon}
          label={field.label}
          required={field.required}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddFieldModal(true)}
            className={`${STYLES.button} bg-blue-500 hover:bg-blue-600 text-white`}
          >
            <Plus className="w-4 h-4" />
            Thêm Field
          </button>
          <button
            type="button"
            onClick={handlers.addItem}
            className={STYLES.button}
          >
            <Plus className="w-4 h-4" />
            Thêm Item
          </button>
        </div>
      </div>

      <SchemaDisplay
        fields={field.fields}
        onRemoveField={handlers.removeFieldFromSchema}
      />

      <AddFieldModal
        showModal={showAddFieldModal}
        selectedFields={selectedFields}
        onClose={handlers.closeModal}
        onSelectFieldType={handlers.selectFieldType}
        onUpdateSelectedField={handlers.updateSelectedField}
        onRemoveSelectedField={handlers.removeSelectedField}
        onSave={handlers.saveFieldsToSchema}
      />

      <div className="space-y-4">
        {currentData.map((item, index) => (
          <RepeatFieldItem
            key={index}
            item={item}
            index={index}
            fields={field.fields}
            itemLabel={field.itemLabel}
            onUpdate={handlers.updateItem}
            onCopy={handlers.copyItem}
            onRemove={handlers.removeItem}
          />
        ))}

        {currentData.length === 0 && (
          <EmptyRepeatState fields={field.fields} icon={field.icon} />
        )}
      </div>
    </div>
  );
};

export default RepeatField;
