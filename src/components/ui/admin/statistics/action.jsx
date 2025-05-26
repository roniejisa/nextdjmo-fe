"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const getDataStatistic = async (type, time, startTime, endTime) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/statistic",
    {
      Authorization: `Bearer ${token}`,
    },
    { type, time, startTime, endTime },
    "POST"
  );
  return response;
};

export const getCountModule = async (item) => {
  const token = await getToken();
  try {
    const data = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + item.module + "s/count",
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return data.data;
  } catch (e) {
    return 0;
  }
};
