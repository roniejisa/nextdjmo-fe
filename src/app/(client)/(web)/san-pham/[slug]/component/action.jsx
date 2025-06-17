"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const postDraftOrder = async (
  { productId, stock },
  msg,
  searchParams
) => {
  const token = await getToken();
  if (!token) {
    return {
      status: 401,
      message: "Vui lòng đăng nhập!",
    };
  }
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "create-draft-order",
    {
      Authorization: `Bearer ${token}`,
    },
    { product_id: productId, stock },
    "POST",
    true,
    true,
    searchParams,
    msg
  );
};
