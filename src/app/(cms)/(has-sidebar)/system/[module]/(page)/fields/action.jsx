"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataParent = async (module, item, field) => {
  const token = await getToken();
  const jsonBody = {
    one: field.module_label,
    two: field.module_id,
    field: field.name,
  };
  if (item && item?._id) {
    jsonBody.id = item._id;
  }
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-parent`,
    {
      Authorization: `Bearer ${token}`,
    },
    jsonBody,
    "post"
  );
};
export const selectList = async (module, item, field) => {
  const token = await getToken();
  const jsonBody = {
    one: field.module_label,
    two: field.module_id,
    field: field.name,
  };
  if (item && item?._id) {
    jsonBody.id = item._id;
  }
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/select-list`,
    {
      Authorization: `Bearer ${token}`,
    },
    jsonBody,
    "post"
  );
};

export const checkSlug = async (module, slug, id, language) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, slug, id, language },
    "post"
  );
};

export const checkKey = async (module, key, id) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-key`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, key, id },
    "post"
  );
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
