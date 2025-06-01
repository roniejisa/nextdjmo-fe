
// utils/createEmptyItem.js
export const createEmptyItem = (fields) => {
  const item = {};
  fields?.forEach((field) => {
    item[field.key] = field.type === "checkbox" ? false : "";
  });
  return item;
};