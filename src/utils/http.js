"use server";

import { cookies } from "next/headers";
import { clearTokensAndRedirect, refreshTokens } from "./action";

// Global state để track refresh token process
let isRefreshing = false;
let refreshPromise = null;

export const httpClient = async (
  url,
  customHeaders = {},
  body = {},
  method = "GET",
  hasPrefixHeader = true,
  isRetry = false,
  searchParams,
  msg = "Vui lòng đăng nhập!"
) => {
  try {
    const options = {
      cache: "no-store",
      headers: {
        ...customHeaders,
      },
      method,
    };

    // Add token to headers if available
    if (!isRetry) {
      const token = cookies().get("token")?.value;
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    if (hasPrefixHeader) {
      options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] =
        process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
    }

    if (Object.keys(body).length > 0) {
      if (method === "GET") {
        const searchParams = new URLSearchParams(body);
        url = url + "?" + searchParams.toString();
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    } else if (body instanceof FormData) {
      options.body = body;
    }
    const response = await fetch(url, options);
    const data = await response.json();
    // Handle 401 - Token expired
    if (data.status === 401 && !isRetry) {
      // If already refreshing, wait for it to complete
      if (isRefreshing && refreshPromise) {
        try {
          const newToken = await refreshPromise;
          if (newToken) {
            // Retry with new token
            return await httpClient(
              url,
              {
                ...customHeaders,
                Authorization: `Bearer ${newToken}`,
              },
              body,
              method,
              hasPrefixHeader,
              true, // isRetry = true
              searchParams,
              msg
            );
          }
        } catch (error) {
          return clearTokensAndRedirect();
        }
      }

      // Start refresh process
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokens();

        try {
          const newToken = await refreshPromise;
          if (newToken) {
            // Retry original request with new token
            return await httpClient(
              url,
              {
                ...customHeaders,
                Authorization: `Bearer ${newToken}`,
              },
              body,
              method,
              hasPrefixHeader,
              true, // isRetry = true
              searchParams,
              msg
            );
          } else {
            return clearTokensAndRedirect();
          }
        } catch (error) {
          return clearTokensAndRedirect();
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      }
    }

    return data;
  } catch (e) {
    return {
      status: 400,
      message: msg,
      errorMessage: e.message,
      searchParams,
    };
  }
};