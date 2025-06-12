"use server";
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
  return {
    status: status,
    message: "Token expired",
    shouldRedirect: true,
  };
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
