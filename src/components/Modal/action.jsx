"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";

export const handleDeleteModule = async (module, id) => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/${id}`,
    {
      Authorization: `Bearer ${token}`,
    },
    {},
    "DELETE"
  );
  if (
    response.status == 204 ||
    response.status == 200 ||
    response.status == 201
  ) {
    return {
      status: 200,
      message: response?.message,
    };
  }
  return response;
};
