import { useEffect, useRef, useState } from "react";

const MultipleCheckbox = ({ field, defaultValue }) => {
  const [value, setValue] = useState(field.value);
  
  const textareaRef = useRef(null);
  const handleCheckbox = (e) => {
    const isChecked = e.target.checked;
    const newValue = isChecked
      ? [...value, e.target.dataset.value]
      : value.filter((val) => val !== e.target.dataset.value);
    setValue(newValue);
  };

  useEffect(() => {
    textareaRef.current.value = JSON.stringify(value);
  }, [value]);

  useEffect(() => {
    console.log(field.value)
    field.value.forEach((item) => {
      const input = document.querySelector(`input[data-value="${item}"]`)
      if(input) input.checked = true
    })
  },[])
  return (
    <div>
      <textarea name={field.name} hidden ref={textareaRef}></textarea>
      {field.data.map((item, index) => (
        <div key={item._id} className="flex gap-2 cursor-pointer">
          <input
            id={field.name + index}
            type="checkbox"
            data-value={item[field["field_main"]]}
            onChange={handleCheckbox}
          />
          <label htmlFor={field.name + index}>{item[field["field_sub"]]}</label>
        </div>
      ))}
    </div>
  );
};

export default MultipleCheckbox;