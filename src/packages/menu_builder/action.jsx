import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const saveMenu = async (data) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links",
    {
      Authorization: `Bearer ${token}`,
    },
    data,
    "POST"
  );
  return response;
};

export const updateMenu = async (data, id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {
      Authorization: `Bearer ${token}`,
    },
    data,
    "PATCH"
  );
  return response;
};

export const copyMenu = async (id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "PUT"
  );
  return response;
};

export const deleteMenu = async (id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "DELETE"
  );
  return response;
};

export const getMenu = async () => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links",
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return response;
};
