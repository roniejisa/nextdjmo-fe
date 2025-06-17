"use server";
import { httpClient } from "@/utils/http";

export const getDataModule = async (
  module,
  limit = 20,
  page = 1,
  searchParams = {}
) => {
  try {
    const url = new URLSearchParams({
      ...searchParams,
      limit,
      page,
    });
    return httpClient(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `?${url.toString()}`,
      {
        isAdmin: 1,
      }
    );
  } catch (e) {
    return [];
  }
};

export const getSeo = async (module) => {
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `/seo`);
};

export const getDataModuleDetail = async (module, id) => {
  return httpClient(process.env.NEXT_PUBLIC_ENDPOINT_URL + module + `/${id}`, {
    isAdmin: 1,
  });
};

export const changeOrderStatus = async (value, _id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {},
    {
      _id,
      status: value,
    },
    "POST"
  );
  return response;
};

export const changePaymentStatus = async (value, _id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "orders/change-order-status",
    {},
    {
      _id,
      payment_status: value,
    },
    "POST"
  );
  return response;
};

export const deleteItems = async (module, ids) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module,
    {},
    {
      ids,
    },
    "DELETE"
  );
  return response;
};

export const copyItem = async (module, _id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/" + _id,
    {},
    {},
    "PUT"
  );
  return response;
};

export const changeFieldBool = async (module, field, id, value) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + module + "/change-field-bool",
    {},
    {
      field,
      value,
      id,
    },
    "POST"
  );
  return response;
};
