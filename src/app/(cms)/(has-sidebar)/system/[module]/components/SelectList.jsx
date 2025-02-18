"use client";
const SelectList = ({ value, field }) => {
  return <div>{value ? value : "Không có " + field.label}</div>;
};

export default SelectList;
