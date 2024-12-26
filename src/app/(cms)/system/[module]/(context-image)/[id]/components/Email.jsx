"use client";

import TrueOrFalseIcon from "@/components/Icon/TrueOrFalseIcon";
import { isValidEmail } from "@/utils/client/validate";
import { useState } from "react";

const Email = ({ field, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  const [name, setName] = useState(field.name);
  const [isValid, setIsValid] = useState(true);
  const handleChange = (e) => {
    const value = e.target.value.trim();
    setValue(value);
    if (isValidEmail(value)) {
      setName(field.name);
      setIsValid(true);
    } else {
      setName("");
      setIsValid(false);
    }
  };
  return (
    <div className="flex relative">
      <input
        name={name}
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
      />
      <TrueOrFalseIcon isValid={isValid} />
    </div>
  );
};

export default Email;
