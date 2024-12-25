"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getData = async (module) => {
  const token = await getToken();
  return httpClient(`${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}`, {
    Authorization: `Bearer ${token}`,
  });
};

export const checkSlug = async (module, slug) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-slug`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, slug },
    'post'
  );
};

export const checkKey = async (module, key) => {
  const token = await getToken();
  return httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}${module}/check-key`,
    {
      Authorization: `Bearer ${token}`,
    },
    { module, key }
    ,'post'
  );
};
