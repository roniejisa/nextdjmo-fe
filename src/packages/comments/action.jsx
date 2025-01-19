"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const submitReview = async (body) => {
  const token = await getToken();
  const response = httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "danh-gia",
    {
      Authorization: "Bearer " + token,
    },
    body,
    "POST"
  );
  return response;
};

export const getDataComment = async (body) => {
  const response = httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "binh-luan",
    {},
    body,
    "POST"
  );
  return response;
};
