import { makeId } from "@/utils/client";

export const generateCombinations = (attributes) => {
  let combinations = [{}];

  attributes.forEach((attribute, indexAttr) => {
    const { name, values } = attribute;
    const newCombinations = [];

    if (indexAttr == 0 && values.length <= 1) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: values[0]?.id,
          ...combo,
          [name]: values[0].value,
        });
      });
    } else if (
      values.length === 0 ||
      values.every((objValue) => !objValue.value)
    ) {
      combinations.forEach((combo) => {
        newCombinations.push({
          id: indexAttr == 0 ? combo?.id : "",
          ...combo,
          [name]: "",
        });
      });
    } else {
      values
        .filter((value) => value.value)
        .forEach((value) => {
          combinations.forEach((combo) => {
            newCombinations.push({
              id: indexAttr == 0 ? value?.id : "",
              ...combo,
              [name]: value.value,
            });
          });
        });
    }
    combinations = newCombinations;
  });

  return combinations;
};

export const sortData = (data) => {
  const grouped = new Map();

  data.forEach((item) => {
    const value = Object.values(item)[0];

    if (!grouped.has(value)) {
      grouped.set(value, []);
    }
    grouped.get(value).push(item);
  });

  const result = [];
  [...grouped.keys()]
    .sort((a, b) => a - b)
    .forEach((number) => {
      const group = grouped.get(number);
      group.sort((a, b) => {
        if (a.value && b.value) {
          return a.value.localeCompare(b.value);
        }
        return 0;
      });
      result.push(...group);
    });

  return result;
};

export const generateKey = (item) => {
  const arrayData = Object.entries(item)
    .map((entry) => {
      if (!["price", "sku", "stock", "image"].includes(entry[0])) {
        return entry;
      }
      return null;
    })
    .filter((entry) => entry !== null);
  return arrayData.map((entry) => entry.join(":")).join("|");
};

export const generateSKU = (item, listAttribute, existingSKUs = []) => {
  let baseSKU = "";

  listAttribute.forEach((attr) => {
    const value = item[attr.name];
    if (value) {
      const shortValue = value
        .replace(/\s+/g, "")
        .substring(0, 3)
        .toUpperCase();
      baseSKU += shortValue;
    }
  });

  if (!baseSKU) {
    baseSKU = "SKU" + makeId(6).toUpperCase();
  }

  let finalSKU = baseSKU;
  let counter = 1;

  while (existingSKUs.includes(finalSKU)) {
    finalSKU = baseSKU + counter.toString().padStart(2, "0");
    counter++;
  }

  return finalSKU;
};

// Hàm format số để hiển thị với dấu phấy
export const formatNumber = (value) => {
  if (!value) return "";
  // Chỉ format nếu là số
  const numValue = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(numValue)) return value;
  return numValue.toLocaleString("en-US");
};
