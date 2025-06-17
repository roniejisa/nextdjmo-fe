import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth";
const API_KEY = process.env.API_KEY || "123456";
const URL_LOGIN = "/dang-nhap";
const defaultLang = "vi";
const languages = ["en", "vi"];

function deleteTokens(response) {
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  response.cookies.delete("logged");
  return response;
}

// In-memory cache for token verification
const tokenCache = new Map();

// Simplified authenticate function using auth/verify with caching
async function authenticate(
  request,
  token = null,
  refreshToken = null,
  isRefresh = false,
  isOauth = false
) {
  const method = request.method;
  const isSocial = isOauth && token ? true : false;

  token = token ? token : request.cookies.get("token")?.value;
  refreshToken = refreshToken
    ? refreshToken
    : request.cookies.get("refreshToken")?.value;

  // Check current token using auth/verify with cache
  if (token) {
    // Check cache first
    const cacheKey = `token_${token.slice(-20)}`; // Use last 20 chars of token as key
    const cached = tokenCache.get(cacheKey);
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    if (cached && cached.expiresAt > now) {
      // Cache valid if more than 10s remaining
      console.log("Using cached token verification");
      return {
        isAuthenticated: true,
        userId: cached.userId,
        username: cached.username,
        accessToken: token,
        refreshToken,
        isSocial,
      };
    }

    try {
      const response = await fetch(AUTH_BASE_URL + "/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const verifyResult = await response.json();
        if (
          verifyResult &&
          verifyResult.status === 200 &&
          verifyResult.data &&
          verifyResult.data.valid
        ) {
          // Cache the result
          tokenCache.set(cacheKey, {
            userId: verifyResult.data.user_id,
            username: verifyResult.data.username,
            expiresAt: verifyResult.data.expires_at,
            cachedAt: now,
          });

          // Clean up expired cache entries periodically
          if (tokenCache.size > 1000) {
            // Prevent memory leak
            cleanupCache();
          }

          console.log("Token verified and cached");
          return {
            isAuthenticated: true,
            userId: verifyResult.data.user_id,
            username: verifyResult.data.username,
            accessToken: token,
            refreshToken,
            isSocial,
          };
        }
      } else if (response.status === 401) {
        console.log("Token expired or invalid, status:", response.status);
        // Remove from cache if exists
        tokenCache.delete(cacheKey);
      } else {
        console.log("Verify failed with status:", response.status);
      }
    } catch (error) {
      console.error("Token verify error:", error);
    }
  }

  // If token is invalid or expired, try to refresh
  if (refreshToken && !isRefresh && method === "GET") {
    try {
      const refreshResponse = await fetch(AUTH_BASE_URL + "/refresh-token", {
        headers: {
          "X-API-KEY": API_KEY,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        if (refreshData && refreshData.status === 200 && refreshData.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            refreshData.data;
          console.log("Token refreshed successfully");

          // Call authenticate again with new token to verify
          return await authenticate(
            request,
            accessToken,
            newRefreshToken,
            true,
            isOauth
          );
        } else {
          console.log("Refresh token response invalid:", refreshData?.status);
        }
      } else if (refreshResponse.status === 401) {
        console.log("Refresh token expired or invalid");
      } else {
        console.log(
          "Refresh token failed with status:",
          refreshResponse.status
        );
      }
    } catch (error) {
      console.error("Refresh token error:", error);
    }
  }

  return { isAuthenticated: false, isSocial, shouldClearTokens: true };
}

function setResponse(
  userId,
  username,
  accessToken,
  refreshToken,
  request,
  isAuthenticated,
  isSocial,
  newCustomer,
  shouldClearTokens = false
) {
  const headers = new Headers();

  // Only set basic user info in headers if authenticated
  if (isAuthenticated && userId) {
    headers.set("userId", userId);
    headers.set("username", username || "");
  }

  let response;

  if (isSocial) {
    if (!isAuthenticated) {
      response = NextResponse.redirect(new URL(URL_LOGIN, request.url));
      response.cookies.set("msg", "Đăng nhập không thành công!", {
        httpOnly: false,
        sameSite: "Strict",
      });
    } else {
      response = NextResponse.redirect(
        new URL(newCustomer ? "/account/profile" : "/", request.url)
      );
    }
  } else {
    response = NextResponse.next({
      request: {
        headers: headers,
      },
    });
  }

  // Clear tokens if needed
  if (shouldClearTokens) {
    deleteTokens(response);
  } else {
    // Set tokens if authenticated
    if (accessToken && isAuthenticated) {
      response.cookies.set("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    if (refreshToken && isAuthenticated) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    if (isAuthenticated) {
      response.cookies.set("logged", "OK", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
      });
    }
  }

  // Create separate cookie for session tracking
  const cookieStore = cookies();
  const ssId = cookieStore.has("ssId")
    ? cookieStore.get("ssId").value
    : makeid(12);
  response.cookies.set("ssId", ssId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

function getLanguage(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const language =
    languages.find((language) => language === pathname.split("/")[1]) ??
    defaultLang;
  return language;
}

export async function middleware(request) {
  const url = request.nextUrl;
  const requireRoutes = ["/system"];
  const pathname = url.pathname;
  const method = request.method;

  if (pathname.includes(".") && !pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Skip middleware for specific paths
  if (method !== "GET" || pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
  }

  let socialAuth = {};
  if (pathname === "/") {
    socialAuth = extractSocialAuthParams(url);
  }

  const { socialToken, socialRefreshToken, isOauth, newCustomer } = socialAuth;
  console.log(pathname);
  try {
    const authResult = await authenticate(
      request,
      socialToken,
      socialRefreshToken,
      false,
      isOauth
    );
    const {
      isAuthenticated,
      userId,
      username,
      accessToken,
      refreshToken,
      isSocial,
      shouldClearTokens,
    } = authResult;

    // Handle login page
    if (pathname === URL_LOGIN) {
      if (isAuthenticated === true) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.headers.set("Cache-Control", "no-store, must-revalidate");
        return response;
      }

      const response = NextResponse.next();
      const cookieStore = cookies();
      const ref = cookieStore.has("ref")
        ? cookieStore.get("ref").value
        : url.searchParams.get("ref") || null;
      if (ref) {
        response.cookies.set("ref", ref, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      response.headers.set("Cache-Control", "no-store, must-revalidate");
      deleteTokens(response);
      return response;
    }

    // Check protected routes
    const isRedirectLogin =
      !isAuthenticated &&
      requireRoutes.some((router) => pathname.startsWith(router));

    if (isRedirectLogin) {
      const response = NextResponse.redirect(new URL(URL_LOGIN, request.url));
      response.headers.set("Cache-Control", "no-store, must-revalidate");
      deleteTokens(response);
      return response;
    }

    // Set language and response
    const language = getLanguage(request);
    const response = setResponse(
      userId,
      username,
      accessToken,
      refreshToken,
      request,
      isAuthenticated,
      isSocial,
      newCustomer,
      shouldClearTokens
    );

    response.cookies.set("lang", language, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Middleware authentication error:", error);

    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    deleteTokens(response);

    const isProtectedRoute = requireRoutes.some((router) =>
      pathname.startsWith(router)
    );
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(URL_LOGIN, request.url));
    }

    return response;
  }
}

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function extractSocialAuthParams(url) {
  const socialToken = url.searchParams.get("token") || null;
  const socialRefreshToken = url.searchParams.get("refreshToken") || null;
  const newCustomer = url.searchParams.get("created") || null;

  return {
    socialToken,
    socialRefreshToken,
    newCustomer,
    isOauth: !!newCustomer,
  };
}

// Cache cleanup function
function cleanupCache() {
  const now = Math.floor(Date.now() / 1000);
  const keysToDelete = [];

  for (const [key, value] of tokenCache.entries()) {
    if (value.expiresAt <= now) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => tokenCache.delete(key));
  console.log(`Cleaned up ${keysToDelete.length} expired cache entries`);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
  ],
};
