"use server";

import { httpClient } from "@/utils/http";

export const orderNow = async (body) => {
  return await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "order-now",
    {},
    body,
    "POST"
  );
};
