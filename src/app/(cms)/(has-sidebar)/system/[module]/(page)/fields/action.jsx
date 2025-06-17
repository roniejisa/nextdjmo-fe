"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataParent = async (module, item, field) => {
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
    {},
    jsonBody,
    "post"
  );
};
export const selectList = async (module, item, field) => {
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
    {},
    jsonBody,
    "post"
  );
};

export const checkSlug = async (module, slug, language, item) => {
  const jsonBody = {
    module,
    slug,
  };
  if (language) {
    jsonBody.language = language;
  }
  if (item && item?._id) {
    jsonBody.id = item?._id;
  }
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {},
    jsonBody,
    "post"
  );
};

export const checkKey = async (module, key, id) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-key`,
    {},
    { module, key, id },
    "post"
  );
};

export const enableOtp = async (formData) => {
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/enable-otp",
    {
      isAdmin: 1,
    },
    formData,
    "POST"
  );
  return data;
};

export const confirmOtp = async (body) => {
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/verify-otp",
    {
      isAdmin: 1,
    },
    body,
    "POST"
  );
  return data;
};

export const disabledOtp = async (body) => {
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/disable-otp",
    {
      isAdmin: 1,
    },
    body,
    "POST"
  );
  return data;
};
