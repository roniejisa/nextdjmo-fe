// utils/validateFields.js
export const validateSelectedFields = (selectedFields, existingFields) => {
  const errors = [];

  selectedFields.forEach((field, index) => {
    const fieldNumber = index + 1;

    if (!field.key?.trim()) {
      errors.push(`Field #${fieldNumber}: Key không được để trống`);
    } else if (field.key.includes(" ")) {
      errors.push(`Field #${fieldNumber}: Key không được chứa khoảng trắng`);
    } else if (existingFields?.some((f) => f.key === field.key)) {
      errors.push(`Field #${fieldNumber}: Key "${field.key}" đã tồn tại`);
    }

    if (!field.customLabel?.trim()) {
      errors.push(`Field #${fieldNumber}: Label không được để trống`);
    }

    if (field.type === "select" && !field.options?.trim()) {
      errors.push(`Field #${fieldNumber}: Select field cần có options`);
    }
  });

  return errors;
};