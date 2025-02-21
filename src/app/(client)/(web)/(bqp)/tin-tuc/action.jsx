"use server";

import { httpClient } from "@/utils/http";

export const getNews = async (page = 1, limit = 10) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `news?page=${page}&limit=${limit}`
  );
  return response;
};
