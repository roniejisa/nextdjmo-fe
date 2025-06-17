"use client";

import TrueOrFalseIcon from "@/components/Icon/TrueOrFalseIcon";
import { isValidEmail } from "@/utils/client";
import { useEffect, useMemo, useState } from "react";

const Email = ({ field, value: initialValue }) => {
  const memoInitialValue = useMemo(() => initialValue, [initialValue]);
  const [value, setValue] = useState(memoInitialValue);
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

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex relative">
      <input
        name={name}
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
        autoComplete="off"
      />
      <TrueOrFalseIcon isValid={isValid} />
    </div>
  );
};

export default Email;
