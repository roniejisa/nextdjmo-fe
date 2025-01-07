"use server";

import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const deleteFile = async (id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `files/${id}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "DELETE"
  );
  return response
};
