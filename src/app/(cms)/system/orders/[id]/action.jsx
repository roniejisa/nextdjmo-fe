"use server";

const { httpClient } = require("@/utils/http");
const { getToken } = require("@/utils/server/utils");

export const changeOrderStatus = async (body) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {
      Authorization: `Bearer ${token}`,
    },
    body
  ,"POST");
  
  return response
};
