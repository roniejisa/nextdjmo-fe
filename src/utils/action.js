"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const refreshTokens = async () => {
  console.log('[Refresh] Starting token refresh process');
  
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      console.log('[Refresh] No refresh token found');
      return {
        success: false,
        error: "No refresh token found",
      };
    }

    console.log('[Refresh] Making refresh request to:', `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/refresh-token`);
    
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
        cache: "no-store", // QUAN TRỌNG: Không cache refresh token requests
      }
    );

    console.log('[Refresh] Response status:', response.status);
    
    let data;
    try {
      data = await response.json();
      console.log('[Refresh] Response data:', data);
    } catch (parseError) {
      console.error('[Refresh] JSON parse error:', parseError);
      return {
        success: false,
        error: "Invalid response format",
      };
    }

    if (response.ok && data.status === 200 && data.data) {
      console.log('[Refresh] Token refresh successful');
      
      // Set new access token
      cookieStore.set("token", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour cho access token
        path: "/",
      });

      // Set new refresh token if provided
      if (data.data.refreshToken) {
        cookieStore.set("refreshToken", data.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days cho refresh token
          path: "/",
        });
      }

      return {
        success: true,
        newToken: data.data.accessToken,
        data: data.data,
      };
    } else {
      console.error('[Refresh] Token refresh failed:', data);
      
      // Clear invalid tokens
      cookieStore.delete("token");
      cookieStore.delete("refreshToken");

      return {
        success: false,
        error: data.message || "Refresh token failed",
      };
    }
  } catch (error) {
    console.error("[Refresh] Network error:", error);

    // Clear tokens on network error
    try {
      cookies().delete("token");
      cookies().delete("refreshToken");
    } catch (cookieError) {
      console.error("[Refresh] Error clearing cookies:", cookieError);
    }

    return {
      success: false,
      error: error.message || "Network error during token refresh",
    };
  }
};

export async function handleAuthRedirect() {
  console.log('[Auth] Handling auth redirect - clearing cookies');
  
  try {
    const cookieStore = cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete("token");
    cookieStore.delete("sessionId");
  } catch (e) {
    console.error("Error clearing cookies:", e);
  }
  
  redirect("/dang-nhap");
}