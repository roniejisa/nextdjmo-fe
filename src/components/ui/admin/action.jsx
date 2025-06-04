"use server";
import { clearTokensAndRedirect } from "@/utils/action";
import { httpClient } from "@/utils/http";
import { getRefreshToken, getToken } from "@/utils/server/utils";

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
  return clearTokensAndRedirect();
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
