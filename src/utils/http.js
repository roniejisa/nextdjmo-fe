"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Constants
const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};

const DEFAULT_OPTIONS = { cache: "no-cache" };
const DEFAULT_ERROR_MESSAGE = "SERVER ERROR!";

/**
 * Enhanced HTTP client with automatic token refresh and error handling
 */
export const httpClient = async (
  url,
  customHeaders = {},
  body = {},
  method = "GET",
  hasPrefixHeader = true,
  isRefresh = false,
  searchParams = {},
  msg = DEFAULT_ERROR_MESSAGE,
  nextOptions = DEFAULT_OPTIONS
) => {
  try {
    const requestUrl = buildRequestUrl(url, body, method);
    const requestOptions = buildRequestOptions({
      customHeaders,
      hasPrefixHeader,
      body,
      method,
      nextOptions,
    });

    const response = await fetch(requestUrl, requestOptions);
    const data = await response.json();

    // Handle unauthorized response
    if (data.status === HTTP_STATUS.UNAUTHORIZED) {
      return await handleUnauthorizedResponse({
        url: requestUrl,
        customHeaders,
        body,
        method,
        hasPrefixHeader,
        isRefresh,
        searchParams,
        msg,
        nextOptions,
      });
    }

    return data;
  } catch (error) {
    return createErrorResponse(error, url, searchParams, msg);
  }
};

/**
 * Build complete request URL with query parameters for GET requests
 */
function buildRequestUrl(url, body, method) {
  if (method === "GET" && body && Object.keys(body).length > 0) {
    const searchParams = new URLSearchParams(body);
    return `${url}?${searchParams.toString()}`;
  }
  return url;
}

/**
 * Build request options including headers and body
 */
function buildRequestOptions({
  customHeaders,
  hasPrefixHeader,
  body,
  method,
  nextOptions,
}) {
  const options = {
    headers: { ...customHeaders },
    method,
    ...nextOptions,
  };

  // Add prefix header if required
  if (hasPrefixHeader) {
    options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] =
      process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
  }

  // Handle request body
  if (body instanceof FormData) {
    options.body = body;
  } else if (method !== "GET" && body && Object.keys(body).length > 0) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  return options;
}

/**
 * Handle unauthorized response with token refresh logic
 */
async function handleUnauthorizedResponse({
  url,
  customHeaders,
  body,
  method,
  hasPrefixHeader,
  isRefresh,
  searchParams,
  msg,
  nextOptions,
}) {
  // If this is already a refresh attempt, return error response
  if (isRefresh) {
    return createUnauthorizedResponse(searchParams, msg);
  }

  const refreshToken = cookies().get("refreshToken")?.value;
  
  if (!refreshToken) {
    return createUnauthorizedResponse(searchParams, msg);
  }

  try {
    const newTokens = await refreshAccessToken(refreshToken);
    
    if (!newTokens) {
      return clearTokensAndRedirect();
    }

    // Retry original request with new access token
    return await httpClient(
      url,
      {
        ...customHeaders,
        Authorization: `Bearer ${newTokens.accessToken}`,
      },
      body,
      method,
      hasPrefixHeader,
      true, // isRefresh = true
      searchParams,
      msg,
      nextOptions
    );
  } catch (error) {
    console.error("Token refresh failed:", error);
    return clearTokensAndRedirect();
  }
}

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
          "X-API-KEY": "123456",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const data = await response.json();

    if (data.status === HTTP_STATUS.OK && data.data) {
      // Update cookies with new tokens
      updateTokenCookies(data.data.accessToken, data.data.refreshToken);
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
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
  };

  cookies().set({
    name: "token",
    value: accessToken,
    ...cookieOptions,
  });

  cookies().set({
    name: "refreshToken",
    value: refreshToken,
    ...cookieOptions,
  });
}

/**
 * Create standardized error response for server errors
 */
function createErrorResponse(error, url, searchParams, message) {
  return {
    status: HTTP_STATUS.SERVER_ERROR,
    message,
    errorMessage: error.message,
    timestamp: new Date().toISOString(),
    searchParams,
    path: url,
  };
}

/**
 * Create unauthorized response
 */
function createUnauthorizedResponse(searchParams, message) {
  return {
    status: HTTP_STATUS.UNAUTHORIZED,
    searchParams,
    message,
  };
}

/**
 * Clear authentication tokens and redirect to login page
 */
function clearTokensAndRedirect() {
  cookies().delete("token");
  cookies().delete("refreshToken");
  cookies().set("msg", "Vui lòng đăng nhập!");
  return redirect("/dang-nhap");
}