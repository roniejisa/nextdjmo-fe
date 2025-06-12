"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const refreshTokens = async () => {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;

    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token found",
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY]:
            process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE,
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.status === 200 && data.data) {
      // Set new tokens
      cookies().set("token", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      if (data.data.refreshToken) {
        cookies().set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      return {
        success: true,
        newToken: data.data.accessToken,
        data: data.data,
      };
    } else {
      // Clear invalid tokens
      cookies().delete("token");
      cookies().delete("refreshToken");

      return {
        success: false,
        error: data.message || "Refresh token failed",
      };
    }
  } catch (error) {
    console.error("Error refreshing tokens:", error);

    // Clear tokens on error
    cookies().delete("token");
    cookies().delete("refreshToken");

    return {
      success: false,
      error: error.message || "Network error during token refresh",
    };
  }
};

export async function handleAuthRedirect() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("token");
  } catch (e) {
    console.error("Error clearing cookies:", e);
  }
  redirect("/dang-nhap");
}
