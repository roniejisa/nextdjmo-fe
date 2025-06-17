import { httpClient } from "@/utils/http";

export const saveMenu = async (data) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links",
    {},
    data,
    "POST"
  );
  return response;
};

export const updateMenu = async (data, id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {},
    data,
    "PATCH"
  );
  return response;
};

export const copyMenu = async (id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {},
    {},
    "PUT"
  );
  return response;
};

export const deleteMenu = async (id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links/" + id,
    {},
    {},
    "DELETE"
  );
  return response;
};

export const getMenu = async () => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "links",
    {}
  );
  return response;
};
