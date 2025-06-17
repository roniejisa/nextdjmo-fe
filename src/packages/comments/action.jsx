"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const submitReview = async (body) => {
  const token = await getToken();
  if (!token) {
    return { status: 401 };
  }
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "add-comment",
    {
      Authorization: "Bearer " + token,
    },
    body,
    "POST",
    true,
    true
  );
  return response;
};

export const submitReaction = async (body) => {
  const token = await getToken();
  if (!token) {
    return { status: 401 };
  }
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "add-reaction",
    {
      Authorization: "Bearer " + token,
    },
    body,
    "POST",
    true,
    true
  );
  return response;
};

export const getDataComment = async (body) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-comments",
    {},
    body,
    "POST"
  );
  return response;
};
