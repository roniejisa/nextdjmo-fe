"use client";

import { isValidPhone } from "@/utils/client";
import { useRef, useState } from "react";

const Phone = ({ field, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);
  const [isStartValid, setIsStartValid] = useState(false); // Kiểm tra điều kiện bắt đầu
  const [isLengthValid, setIsLengthValid] = useState(false); // Kiểm tra độ dài
  const [name, setName] = useState("");
  const handleChange = (e) => {
    const value = e.target.value.trim();
    setValue(value);

    // Kiểm tra bắt đầu bằng +84 hoặc 0
    setIsStartValid(/^(\+84|0)/.test(value));

    // Kiểm tra độ dài (bỏ phần đầu)
    setIsLengthValid(value.replace(/^(\+84|0)/, "").length === 9);
    isValidPhone(value) ? setName(field.name) : setName("");
  };
  return (
    <>
      <input
        name={name}
        placeholder={field.placeholder}
        value={value}
        autoComplete="off"
        onChange={handleChange}
        className="w-full outline-outline outline-4 transition border rounded-md p-2"
      />
      <ul className="mt-2 text-sm pl-10">
        <li className={`list-disc ${isStartValid ? "text-green-500" : "text-red-600"}`}>
          Bắt đầu bằng +84 hoặc 0
        </li>
        <li className={`list-disc ${isLengthValid ? "text-green-500" : "text-red-600"}`}>
          Có 9 ký tự đằng sau
        </li>
      </ul>
    </>
  );
};

export default Phone;
