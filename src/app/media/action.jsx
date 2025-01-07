"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const postCreateFolder = async (body) => {
  const token = await getToken();
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/create-folder",
    {
      Authorization: `Bearer ${token}`,
    },
    body,
    "POST"
  );
};

export const fetchPosts = async (limit = 10, page = 1, obj = {}) => {
  const token = await getToken();
  limit = limit ?? 10;
  page = page ?? 1;
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files",
    {
      Authorization: `Bearer ${token}`,
    },
    { limit: limit, page: page, ...obj },
    "GET"
  );
  return response.data;
};

export const getFolders = async (body) => {
  const token = await getToken();
  return await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/get-folders",
    {
      Authorization: `Bearer ${token}`,
    },
    body,
    "POST"
  );
};
