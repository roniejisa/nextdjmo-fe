"use server";
import { getToken } from "@/utils/server/utils";

export const handleDeleteModule = async (module, id) => {
  const token = await getToken();
  const response = await fetch(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + `${module}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": "123456",
      },
      method: "DELETE",
    }
  );
  if (response.ok) {
    return {
      status: 200,
    };
  }
  const data = await response.json()
  return data;
};
