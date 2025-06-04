"use server";

import { redirect } from "next/navigation";

const { cookies } = require("next/headers");

// Separate function to handle token refresh
export async function refreshTokens() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(
      process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": "123456",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await response.json();

    if (data.status === 200) {
      // Update cookies with new tokens
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

      return data.data.accessToken;
    } else {
      throw new Error("Failed to refresh token");
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function clearTokensAndRedirect() {
  cookies().delete("token");
  cookies().delete("refreshToken");
  cookies().set("msg", "Vui lòng đăng nhập!");
  return redirect("/dang-nhap");
}