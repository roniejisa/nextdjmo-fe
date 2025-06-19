"use server";

import { httpClient } from "@/utils/http";

export const getConfiguration = async (tab) => {
  const data = await httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}configurations/${tab}`,
    {},
    {},
    "POST"
  );

  return data;
};

export const configLanguage = async (body) => {
  const data = await httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}configurations/config-language`,
    {},
    body,
    "POST"
  );
  return data;
};
