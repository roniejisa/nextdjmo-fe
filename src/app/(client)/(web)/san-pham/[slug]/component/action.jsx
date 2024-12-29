"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const postDraftOrder = async ({ productId, stock }) => {
  const token = await getToken();
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "create-draft-order",
    {
      Authorization: `Bearer ${token}`,
    },
    { product_id: productId, stock },
    "POST"
  );
};
