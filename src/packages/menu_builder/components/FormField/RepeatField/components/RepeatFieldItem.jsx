// components/RepeatFieldItem.jsx
import React from "react";
import { Copy, Minus } from "lucide-react";
import { STYLES } from "../constants/styles";
import RepeatSubField from "./RepeatSubField";

const RepeatFieldItem = ({
  item,
  index,
  fields,
  itemLabel,
  onUpdate,
  onCopy,
  onRemove,
}) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-medium text-gray-700">
        {itemLabel || "Item"} #{index + 1}
      </h4>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCopy(index)}
          className={`${STYLES.iconButton} hover:text-blue-600`}
          title="Sao chép"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className={`${STYLES.iconButton} hover:text-red-600`}
          title="Xóa"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3">
      {fields?.map((subField) => (
        <RepeatSubField
          key={subField.key}
          field={subField}
          value={item}
          onChange={onUpdate}
          index={index}
        />
      ))}
    </div>

    <details className="mt-3">
      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
        Xem JSON
      </summary>
      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
        {JSON.stringify(item, null, 2)}
      </pre>
    </details>
  </div>
);

export default RepeatFieldItem;