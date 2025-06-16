"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { cookies } from "next/headers";

export const handleUpdate = async (module, id, formData, language) => {
  const token = await getToken();
  console.log(Object.fromEntries(formData))
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

export const enableOtp = async (formData) => {
  const token = await getToken();
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/enable-otp",
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    },
    formData,
    "POST"
  );
  return data;
};

export const confirmOtp = async (body) => {
  const token = await getToken();
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/verify-otp",
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    },
    body,
    "POST"
  );
  return data;
};

export const disabledOtp = async (body) => {
  const token = await getToken();
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/disable-otp",
    {
      isAdmin: 1,
      Authorization: `Bearer ${token}`,
    },
    body,
    "POST"
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
