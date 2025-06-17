"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataDraftOrder = async () => {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      message: "Vui lòng đăng nhập!",
    };
  }
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-draft-order",
    {}
  );
};

export const deleteItemInDraftOrder = async (id) => {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      message: "Vui lòng đăng nhập!",
    };
  }
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "delete-draft-order",
    {},
    { id },
    "DELETE"
  );
};

export const updateItemInDraftOrder = async (id, qty) => {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      message: "Vui lòng đăng nhập!",
    };
  }
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "update-draft-order",
    {},
    { id, qty },
    "PATCH"
  );
};
