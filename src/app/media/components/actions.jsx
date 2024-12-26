"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const handleUpdateImage = async (formData) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "media/edit-file",
    {
      Authorization: `Bearer ${token}`,
    },
    formData,
    "PATCH",
    false
  );

  return response;
};

export const checkHistoryFile = async (id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "media/history-file/" + id,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "GET",
    false
  );
  return response;
};
