"use server";

const { httpClient } = require("@/utils/http");

export const changeOrderStatus = async (body) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {},
    body,
    "POST"
  );

  return response;
};

export const addActivityForOrder = async (body) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/add-activity-for-order",
    {},
    body,
    "POST"
  );

  return response;
};
