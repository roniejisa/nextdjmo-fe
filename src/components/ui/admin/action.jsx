"use server";
import { httpClient } from "@/utils/http";
import { getToken } from "@/utils/server/utils";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  cookies().delete("token");
  cookies().delete("refreshToken");
  cookies().delete("logged");
  return true;
};

export const getMenu = async () => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-menu-system",
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return response.data;
};
