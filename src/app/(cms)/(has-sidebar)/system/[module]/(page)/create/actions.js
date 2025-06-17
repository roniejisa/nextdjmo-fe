"use server";

import { httpClient } from "@/utils/http";

export const handleCreate = async (module, formData, language) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `${module}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
    },
    formData,
    "POST"
  );
  return response;
};

export const getDataLanguage = async (module, language, _id = null) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/get-data-language`,
    {
      isAdmin: 1,
    },
    {
      module,
      language,
      _id,
    }
  );
  return response;
};

export const moduleDetail = async (module, language) => {
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `${module}/create` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
    }
  );
};
