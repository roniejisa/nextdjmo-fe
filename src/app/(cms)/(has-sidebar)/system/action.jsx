"use server";

import { httpClient } from "@/utils/http";

export const getDataHistory = async (
  email = "",
  startTime = "",
  endTime = ""
) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "history/filter",
    {},
    { email, startTime, endTime },
    "POST"
  );
  return response;
};
