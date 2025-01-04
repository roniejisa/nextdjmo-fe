"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataDraftOrder = async () => {
  const token = await getToken();
  if (!token) return {};
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-draft-order", {
    Authorization: `Bearer ${token}`,
  });
};

export const deleteItemInDraftOrder = async (id) => {
  const token = await getToken();
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "delete-draft-order",
    {
      Authorization: `Bearer ${token}`,
    },
    { id },
    "DELETE"
  );
};

export const updateItemInDraftOrder = async (id, qty) => {
  const token = await getToken();
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "update-draft-order",
    {
      Authorization: `Bearer ${token}`,
    },
    { id, qty },
    "PATCH"
  );
};
