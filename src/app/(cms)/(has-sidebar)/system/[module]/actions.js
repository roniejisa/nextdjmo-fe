"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { headers } from "next/headers";

export const getDataModule = async (
  module,
  limit = 20,
  page = 1,
  searchParams = {}
) => {
  try {
    const token = await getToken();
    const url = new URLSearchParams({
      ...searchParams,
      limit,
      page,
    });
    return httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `?${url.toString()}`,
      {
        isAdmin: 1,
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (e) {
    return [];
  }
};

export const getDataModuleDetail = async (module, id) => {
  const token = await getToken();
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `/${id}/`, {
    isAdmin: 1,
    Authorization: `Bearer ${token}`,
  });
};

export const getProfile = async () => {
  const header = await headers();
  const user = header.get("user");
  if (user && user != "undefined") {
    return JSON.parse(decodeURIComponent(user));
  } else {
    console.log("đang chạy vào đây")
    try {
      const token = await getToken();
      const response = await httpClient(
        process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/profile",
        {
          Authorization: `Bearer ${token}`,
        },
        {}
      );
      return response;
    } catch (e) {
      return {
        status: 401,
        message: "Token expired",
        shouldRedirect: true,
      };
    }
  }
};

export const changeOrderStatus = async (value, _id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      _id,
      status: value,
    },
    "POST"
  );
  return response;
};

export const changePaymentStatus = async (value, _id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      _id,
      payment_status: value,
    },
    "POST"
  );
  return response;
};

export const deleteItems = async (module, ids) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module,
    {
      Authorization: `Bearer ${token}`,
    },
    {
      ids,
    },
    "DELETE"
  );
  return response;
};

export const copyItem = async (module, _id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/" + _id,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "PUT"
  );
  return response;
};

export const changeFieldBool = async (module, field, id, value) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/change-field-bool",
    {
      Authorization: `Bearer ${token}`,
    },
    {
      field,
      value,
      id,
    },
    "POST"
  );
  return response;
};
