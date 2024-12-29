"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataDraftOrder = async () => {
  const token = await getToken();
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-draft-order", {
    Authorization: `Bearer ${token}`,
  });
};
