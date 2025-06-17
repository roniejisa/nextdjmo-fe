"use server";

import { httpClient } from "@/utils/http";

export const getData = async (module, fields = ["_id", "name"]) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}?fields=${fields}`
  );
};

export const checkSlug = async (module, slug) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {},
    { module, slug },
    "post"
  );
};

export const checkKey = async (module, key) => {
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-key`,
    {},
    { module, key },
    "post"
  );
};
