"use server";
import { httpClient } from "@/utils/http";

export const handleUpdate = async (module, id, formData, language) => {
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `${module}/${id}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
    },
    Object.fromEntries(formData),
    "PATCH"
  );
  return data;
};

export const moduleDetail = async (module, id, language = null) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/${id}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
    }
  );
};
