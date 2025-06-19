"use client";
const SelectList = ({ value, field }) => {
  return <span className="truncate">{value ? value : "Không có " + field.label}</span>;
};

export default SelectList;
