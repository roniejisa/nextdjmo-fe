// utils/processFields.js
export const processSelectedFields = (selectedFields) => {
  return selectedFields.map((field) => ({
    key: field.key.trim(),
    label: field.customLabel.trim(),
    type: field.type,
    required: false,
    ...(field.type === "select" && {
      options: field.options
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt),
    }),
  }));
};