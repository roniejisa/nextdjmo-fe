"use server";
import { httpClient } from "@/utils/http";
import { getRefreshToken, getToken } from "@/utils/server/utils";
import { cookies } from "next/headers";

export const handleLogout = async () => {
  const refreshToken = await getRefreshToken();

  // Call API logout
  const data = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/logout",
    {},
    { refreshToken },
    "POST"
  );

  // Clear cookies
  cookies().delete("token");
  cookies().delete("refreshToken");
  cookies().delete("logged");
  cookies().delete("ssId");

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
