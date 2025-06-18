import { useEffect, useRef, useState } from "react";

const MultipleCheckbox = ({ field, value: initialValue }) => {
  const [value, setValue] = useState(() => {
    // Đảm bảo initial state luôn là array
    return Array.isArray(field?.value) ? field.value : [];
  });
  const textareaRef = useRef(null);

  const handleCheckbox = (e) => {
    const isChecked = e.target.checked;
    const safeValue = Array.isArray(value) ? value : [];
    const newValue = isChecked
      ? [...safeValue, e.target.dataset.value]
      : safeValue.filter((val) => val !== e.target.dataset.value);
    setValue(newValue);
  };

  // Cập nhật state khi field.value thay đổi
  useEffect(() => {
    const safeFieldValue = Array.isArray(field?.value) ? field.value : [];
    setValue(safeFieldValue);
  }, [field?.value]);

  // Cập nhật textarea value khi value state thay đổi
  useEffect(() => {
    if (textareaRef.current) {
      const safeValue = Array.isArray(value) ? value : [];
      textareaRef.current.value = JSON.stringify(safeValue);
    }
  }, [value]); // Sử dụng value state thay vì field

  // Đồng bộ checkbox với state value
  useEffect(() => {
    const safeValue = Array.isArray(value) ? value : [];

    // Reset tất cả checkbox của component này
    field?.data?.forEach((item, index) => {
      const checkbox = document.getElementById(field.name + index);
      if (checkbox) {
        checkbox.checked = false;
      }
    });

    // Sau đó check những checkbox có value trong state
    safeValue.forEach((item) => {
      field?.data?.forEach((dataItem, index) => {
        if (dataItem[field?.field_main] === item) {
          const checkbox = document.getElementById(field.name + index);
          if (checkbox) {
            checkbox.checked = true;
          }
        }
      });
    });
  }, [value, field?.data, field?.name, field?.field_main]);

  return (
    <div>
      <textarea
        name={field?.name}
        hidden
        ref={textareaRef}
        defaultValue={JSON.stringify(Array.isArray(value) ? value : [])}
        readOnly
      />
      {field?.data?.map((item, index) => (
        <div key={item._id} className="flex gap-2 cursor-pointer">
          <input
            id={field.name + index}
            type="checkbox"
            data-value={item[field?.field_main]}
            onChange={handleCheckbox}
          />
          <label htmlFor={field.name + index} className="cursor-pointer">
            {item[field?.field_sub]}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultipleCheckbox;