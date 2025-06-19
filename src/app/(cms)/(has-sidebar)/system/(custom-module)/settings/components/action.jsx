"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getData = async (module, item, field) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-parent`,
    {},
    {
      id: item._id,
      one: field.module_label,
      two: field.module_id,
      field: field.name,
    },
    "post"
  );
};
export const selectList = async (module, item, field) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/select-list`,
    {},
    {
      id: item._id,
      one: field.module_label,
      two: field.module_id,
      field: field.name,
    },
    "post"
  );
};

export const checkSlug = async (module, slug, id) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {},
    { module, slug, id },
    "post"
  );
};