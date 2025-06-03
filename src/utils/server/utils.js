"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Constants
const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
};

export const getToken = async () => {
  const storeCookie = await cookies();
  const token = storeCookie.get("token")?.value;

  if (token) {
    return token;
  }

  // Không có token, thử refresh
  const refreshToken = storeCookie.get("refreshToken")?.value;

  if (!refreshToken) {
    // Không có refresh token, redirect về login
    clearTokensAndRedirect();
    return null;
  }

  try {
    // Gọi API refresh token
    const newTokens = await refreshAccessToken(refreshToken);

    if (newTokens && newTokens.accessToken) {
      // Update cookies với token mới
      updateTokenCookies(newTokens.accessToken, newTokens.refreshToken);
      return newTokens.accessToken;
    } else {
      // Refresh thất bại, clear cookies và redirect
      clearTokensAndRedirect();
      return null;
    }
  } catch (error) {
    console.error("Token refresh failed in getToken:", error);
    clearTokensAndRedirect();
    return null;
  }
};

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY]:
            process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-cache",
      }
    );

    const data = await response.json();

    if (data.status === HTTP_STATUS.OK && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error("Refresh token request failed:", error);
    return null;
  }
}

/**
 * Update authentication cookies with new tokens
 */
function updateTokenCookies(accessToken, refreshToken) {
  const storeCookie = cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  };

  storeCookie.set({
    name: "token",
    value: accessToken,
    ...cookieOptions,
  });

  if (refreshToken) {
    storeCookie.set({
      name: "refreshToken",
      value: refreshToken,
      ...cookieOptions,
    });
  }
}

/**
 * Clear authentication tokens and redirect to login page
 */
function clearTokensAndRedirect() {
  const storeCookie = cookies();
  storeCookie.delete("token");
  storeCookie.delete("refreshToken");
  storeCookie.set({
    name: "msg",
    value: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
    path: "/",
  });
  redirect("/dang-nhap");
}

export const getRefreshToken = async () => {
  const storeCookie = await cookies();
  return storeCookie.get("refreshToken")?.value;
};
