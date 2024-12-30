"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { headers } from "next/headers";

export const getDataModule = async (module, limit = 20, page = 1) => {
  try {
    const token = await getToken()
    return httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `?limit=${limit}&page=${page}`,
      {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (e) {
    return []
  }
};

export const getDataModuleDetail = async (module, id) => {
  const token = await getToken()
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `/${id}/`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};


export const getProfile = async () => {
  const header = await headers()
  const user = header.get('user')
  if (user && user != "undefined") {
    return JSON.parse(decodeURIComponent(user))
  }
  return null
}

export const changeOrderStatus = async (value, _id) => {
  const token = await getToken()
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      _id, status: value
    },
    "POST"
  );
  return response
}

export const changePaymentStatus = async (value, _id) => {
  const token = await getToken()
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      _id, payment_status: value
    },
    "POST"
  );
  return response
}