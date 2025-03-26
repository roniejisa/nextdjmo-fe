"use server";

import { getRefreshToken } from "@/utils/server/utils";
import { cookies } from "next/headers";

export const updateToken = async () => {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/refresh-token",
      {
        method: "POST",
        headers: {
          "X-API-KEY": "123456",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
    const data = await response.json();
    if (data.status == 200) {
      cookies().set({
        name: "token",
        value: data.data.accessToken,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });
      cookies().set({
        name: "refreshToken",
        value: data.data.refreshToken,
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      });
      return true;
    } else {
      console.log("Xử lý lỗi ở chỗ này!");
      return false;
    }
  }
};
