"use server";
import { handleAuthRedirect } from "@/utils/action";
import { httpClient } from "@/utils/http";
import { getRefreshToken, getToken } from "@/utils/server/utils";

export const handleLogout = async () => {
  const refreshToken = await getRefreshToken();

  // Call API logout
  const { status, data, message } = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/logout",
    {},
    { refreshToken },
    "POST"
  );

  // Clear cookies
  return handleAuthRedirect();
};

export const getMenu = async () => {
  const token = await getToken();
  const response = await httpClient(
    process.env.NEXT_PUBLIC_ENDPOINT_URL + "get-menu-system",
    {
      Authorization: `Bearer ${token}`,
    }
  );
  return response;
};
