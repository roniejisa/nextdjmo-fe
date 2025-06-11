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
  typeResponse = "json",
  signal = null, // AbortSignal để cancel request
  isSSE = false // Flag để xác định có phải SSE không
) => {
  const options = {
    cache: "no-cache",
    headers: {
      ...customHeaders,
    },
    method,
  };

  // Thêm signal nếu có
  if (signal) {
    options.signal = signal;
  }

  if (hasPrefixHeader) {
    options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] =
      process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
  }

  // Xử lý headers cho SSE

  if (Object.keys(body).length > 0) {
    if (method === "GET") {
      const searchParams = new URLSearchParams(body);
      url = url + "?" + searchParams.toString();
    } else {
      // Kiểm tra nếu body là FormData thì không set Content-Type
      if (!(body instanceof FormData)) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      } else {
        options.body = body;
      }
    }
  } else if (body instanceof FormData) {
    options.body = body;
  } else if (isSSE) {
    options.headers["Accept"] = "text/event-stream";
    options.headers["Cache-Control"] = "no-cache";
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
            typeResponse,
            signal,
            isSSE
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
            typeResponse,
            signal,
            isSSE
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
    case "stream":
      data = response.body; // Trả về ReadableStream
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

// Utility function để xử lý SSE
export const httpClientSSE = async (
  url,
  customHeaders = {},
  body = {},
  method = "POST",
  hasPrefixHeader = true,
  signal = null
) => {
  return await httpClient(
    url,
    customHeaders,
    body,
    method,
    hasPrefixHeader,
    false,
    null,
    "Vui lòng đăng nhập!",
    "stream",
    signal,
    true // isSSE = true
  );
};

// Enhanced blob client với signal support
export const httpClientBlob = async (
  url,
  customHeaders = {},
  body = {},
  method = "GET",
  hasPrefixHeader = true,
  isRetry = false,
  searchParams,
  msg = "Vui lòng đăng nhập!",
  typeResponse = "blob",
  signal = null
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
    typeResponse,
    signal
  );
};
