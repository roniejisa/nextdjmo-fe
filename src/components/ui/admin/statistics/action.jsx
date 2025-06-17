"use server";

import { httpClient } from "@/utils/http";

export const getDataStatistic = async (type, time, startTime, endTime) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/statistic",
    {},
    { type, time, startTime, endTime },
    "POST"
  );
  return response;
};

export const getCountModule = async (item) => {
  try {
    const data = await httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + item.module + "/count",
      {}
    );
    return data.data;
  } catch (e) {
    return 0;
  }
};
