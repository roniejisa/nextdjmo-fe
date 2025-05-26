"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataHistory = async (email = "", startTime = "", endTime = "") => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "history/filter",
    {
      Authorization: `Bearer ${token}`,
    },
    { email, startTime, endTime },
    "POST"
  );
  return response;
};
