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

// Global refresh state management
let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, tokens = null) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      // Retry the original request with new tokens
      resolve(retryWithNewToken(config, tokens.accessToken));
    }
  });
  
  failedQueue = [];
  isRefreshing = false;
  refreshPromise = null;
};

/**
 * Retry request with new access token
 */
const retryWithNewToken = async (config, accessToken) => {
  const { url, customHeaders, body, method, hasPrefixHeader, searchParams, msg, nextOptions } = config;
  
  return await httpClient(
    url,
    {
      ...customHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
    body,
    method,
    hasPrefixHeader,
    true, // isRefresh = true to prevent infinite loop
    searchParams,
    msg,
    nextOptions
  );
};

/**
 * Enhanced HTTP client with automatic token refresh and request queueing
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

    // Handle unauthorized response with queue management
    if (data.status === HTTP_STATUS.UNAUTHORIZED && !isRefresh) {
      return await handleUnauthorizedWithQueue({
        url: requestUrl,
        customHeaders,
        body,
        method,
        hasPrefixHeader,
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
 * Handle unauthorized response with request queueing
 */
async function handleUnauthorizedWithQueue(config) {
  const refreshToken = cookies().get("refreshToken")?.value;
  
  if (!refreshToken) {
    return clearTokensAndRedirect();
  }

  // If already refreshing, queue this request
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject, config });
    });
  }

  // Start refresh process
  isRefreshing = true;
  
  try {
    // Use shared refresh promise to prevent multiple refresh calls
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken(refreshToken);
    }
    
    const newTokens = await refreshPromise;
    
    if (!newTokens) {
      processQueue(new Error('Token refresh failed'), null);
      return clearTokensAndRedirect();
    }

    // Process all queued requests
    processQueue(null, newTokens);
    
    // Execute the original request with new token
    return await retryWithNewToken(config, newTokens.accessToken);
    
  } catch (error) {
    console.error("Token refresh failed:", error);
    processQueue(error, null);
    return clearTokensAndRedirect();
  }
}

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

  // Add authorization header from cookies if not provided
  if (!options.headers.Authorization) {
    const token = cookies().get("token")?.value;
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
  }

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
 * Refresh access token using refresh token with improved error handling
 */
async function refreshAccessToken(refreshToken) {
  try {
    console.log("🔄 Starting token refresh...");
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY]: process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-cache", // Prevent caching refresh requests
      }
    );

    const data = await response.json();

    if (data.status === HTTP_STATUS.OK && data.data) {
      console.log("✅ Token refresh successful");
      
      // Update cookies with new tokens IMMEDIATELY
      await updateTokenCookies(data.data.accessToken, data.data.refreshToken);
      
      return data.data;
    }

    console.error("❌ Token refresh failed:", data);
    return null;
  } catch (error) {
    console.error("❌ Refresh token request failed:", error);
    return null;
  }
}

/**
 * Update authentication cookies with new tokens (async for immediate update)
 */
async function updateTokenCookies(accessToken, refreshToken) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  try {
    // Set both cookies
    cookies().set({
      name: "token",
      value: accessToken,
      ...cookieOptions,
      maxAge: 60 * 15, // Access token expires in 15 minutes
    });

    cookies().set({
      name: "refreshToken",
      value: refreshToken,
      ...cookieOptions,
    });
    
    console.log("🍪 Cookies updated successfully");
  } catch (error) {
    console.error("❌ Failed to update cookies:", error);
    throw error;
  }
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
 * Clear authentication tokens and redirect to login page
 */
function clearTokensAndRedirect() {
  console.log("🚪 Clearing tokens and redirecting to login");
  
  cookies().delete("token");
  cookies().delete("refreshToken");
  cookies().set("msg", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
  
  return redirect("/dang-nhap");
}

/**
 * Utility function to manually trigger token refresh (useful for testing)
 */
export const forceTokenRefresh = async () => {
  const refreshToken = cookies().get("refreshToken")?.value;
  if (refreshToken) {
    return await refreshAccessToken(refreshToken);
  }
  return null;
};