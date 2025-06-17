"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { cookies } from "next/headers";

export const handleUpdate = async (module, id, formData, language) => {
  const token = await getToken();
  console.log(Object.fromEntries(formData));
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL +
      `${module}/${id}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    },
    Object.fromEntries(formData),
    "PATCH"
  );
  return data;
};

export const moduleDetail = async (module, id, language = null) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/${id}` +
      (language ? `?language=${language}` : ""),
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    }
  );
};
