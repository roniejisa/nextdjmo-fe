"use server";

import { httpClient } from "@/utils/http";

export const deleteFile = async (id) => {
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `files/delete-file/${id}`,
    {},
    {},
    "DELETE"
  );
  return response;
};
