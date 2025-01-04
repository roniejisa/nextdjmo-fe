"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getConfiguration = async (tab) => {
  const token = await getToken();
  const data = await httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}configurations/${tab}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "POST"
  );

  return data;
};

export const configLanguage = async (body) => {
  const token = await getToken();
  const data = await httpClient(
    `${process.env.NEXT_PUBLIC_ENDPOINT_URL}configurations/config-language`,
    {
      Authorization: `Bearer ${token}`,
    },
    body,
    "POST"
  );
  return data
};
