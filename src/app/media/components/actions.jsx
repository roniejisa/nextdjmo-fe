"use server";

import { httpClient } from "@/utils/http";

export const handleUpdateImage = async (formData) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/edit-file",
    {},
    formData,
    "PATCH"
  );

  return response;
};

export const checkHistoryFile = async (id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "files/history-file/" + id,
    {},
    {},
    "GET"
  );
  return response;
};
