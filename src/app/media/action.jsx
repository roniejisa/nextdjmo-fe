"use server";

import { httpClient } from "@/utils/http";

export const postCreateFolder = async (body) => {
  return httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/create-folder",
    {},
    body,
    "POST"
  );
};

export const fetchFiles = async (limit = 10, page = 1, obj = {}) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files",
    {},
    { limit: limit, page: page, ...obj }
  );
  return response;
};

export const getFolders = async (body) => {
  return await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/get-folders",
    {},
    body,
    "POST"
  );
};

export const editFolder = async (body) => {
  return await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/edit-folder",
    {},
    body,
    "PATCH"
  );
};

export const deleteFolder = async (body) => {
  return await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/delete-folder",
    {},
    body,
    "DELETE"
  );
};
