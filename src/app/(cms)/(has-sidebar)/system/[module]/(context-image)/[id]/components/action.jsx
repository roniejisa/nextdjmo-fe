"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getData = async (module, item, field) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-parent`,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      id: item._id,
      one: field.module_label,
      two: field.module_id,
      field: field.name,
    }
  ,'post');
};
export const selectList = async (module, item, field) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/select-list`,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      id: item._id,
      one: field.module_label,
      two: field.module_id,
      field: field.name,
    },
    'post'
  );
};

export const checkSlug = async (module, slug, id) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, slug, id },
    'post'
  );
};

export const checkKey = async (module, key, id) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-key`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, key, id }
    ,'post'
  );
};
