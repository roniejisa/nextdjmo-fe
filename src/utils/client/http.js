import { clearTokensAndRedirect, refreshTokens } from "../action";

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
  msg = "Vui lòng đăng nhập!",
  typeResponse = "json"
) => {
  const options = {
    cache: "no-cache",
    headers: {
      ...customHeaders,
    },
    method,
  };

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
  
  // Kiểm tra 401 trước khi xử lý response body
  if (response.status === 401 && !isRetry) {
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
            msg,
            typeResponse
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
            msg,
            typeResponse
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

  // Xử lý response body sau khi đã handle 401
  let data;
  switch (typeResponse) {
    case "blob":
      data = await response.blob();
      break;
    case "body":
      data = response.body; // Không cần await, body là ReadableStream
      break;
    case "text":
      data = await response.text();
      break;
    default:
      // Kiểm tra content-type cho trường hợp default
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text(); // Fallback cho non-JSON
      }
      break;
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
};

export const httpClientBlob = async (
  url,
  customHeaders = {},
  body = {},
  method = "GET",
  hasPrefixHeader = true,
  isRetry = false,
  searchParams,
  msg = "Vui lòng đăng nhập!",
  typeResponse = "blob"
) => {
  return await httpClient(
    url,
    customHeaders,
    body,
    method,
    hasPrefixHeader,
    isRetry,
    searchParams,
    msg,
    typeResponse
  );
};