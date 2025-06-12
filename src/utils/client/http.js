import { refreshTokens } from "../action";

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
  signal = null,
  isSSE = false
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

  // Thêm prefix header cho API authentication
  if (hasPrefixHeader) {
    options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] =
      process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
  }

  // Xử lý body và headers theo method
  if (Object.keys(body).length > 0) {
    if (method === "GET") {
      // GET method: chuyển body thành query parameters
      const searchParams = new URLSearchParams(body);
      url = url + "?" + searchParams.toString();
    } else {
      // POST/PUT/PATCH: xử lý body
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
    // Server-Sent Events: thiết lập headers đặc biệt
    options.headers["Accept"] = "text/event-stream";
    options.headers["Cache-Control"] = "no-cache";
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    // Xử lý fetch errors (network, abort, etc.)
    if (error.name === 'AbortError') {
      throw new DOMException('Request aborted by user', 'AbortError');
    }
    throw error;
  }

  // Kiểm tra nếu request đã bị abort sau khi fetch - tránh retry không cần thiết
  if (signal && signal.aborted) {
    throw new DOMException('Request aborted after fetch', 'AbortError');
  }

  // Kiểm tra 401 và xử lý refresh token (chỉ khi chưa retry)
  if (response.status === 401 && !isRetry) {
    // Nếu đã có refresh process đang chạy, đợi nó hoàn thành
    if (isRefreshing && refreshPromise) {
      try {
        const refreshResult = await refreshPromise;
        if (refreshResult.success && refreshResult.newToken) {
          console.log("Using refreshed token from concurrent request");
          // Retry với token mới từ concurrent refresh
          return await httpClient(
            url,
            {
              ...customHeaders,
              Authorization: `Bearer ${refreshResult.newToken}`,
            },
            body,
            method,
            hasPrefixHeader,
            true, // isRetry = true để tránh infinite loop
            searchParams,
            msg,
            typeResponse,
            signal,
            isSSE
          );
        } else {
          // Concurrent refresh thất bại
          console.log("Concurrent refresh failed:", refreshResult.error);
          return {
            status: 401,
            message: refreshResult.error || "Token expired",
            shouldRedirect: true,
          };
        }
      } catch (error) {
        console.error("Error waiting for concurrent refresh:", error);
        return {
          status: 401,
          message: "Token refresh failed",
          shouldRedirect: true,
        };
      }
    }

    // Bắt đầu refresh process mới với atomic operation
    if (!isRefreshing) {
      isRefreshing = true;
      console.log("Starting token refresh process...");
      
      // Tạo refresh promise với timeout và automatic cleanup
      refreshPromise = Promise.race([
        refreshTokens(),
        // Timeout sau 10 giây để tránh refresh bị treo
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Token refresh timeout after 10s')), 10000)
        )
      ]).finally(() => {
        // Đảm bảo reset state trong mọi trường hợp (success, error, timeout)
        console.log("Cleaning up refresh state");
        isRefreshing = false;
        refreshPromise = null;
      });

      try {
        const refreshResult = await refreshPromise;
        
        if (refreshResult.success && refreshResult.newToken) {
          console.log("Token refreshed successfully, retrying original request");
          
          // Retry request với token mới
          return await httpClient(
            url,
            {
              ...customHeaders,
              Authorization: `Bearer ${refreshResult.newToken}`,
            },
            body,
            method,
            hasPrefixHeader,
            true, // isRetry = true để tránh infinite loop
            searchParams,
            msg,
            typeResponse,
            signal,
            isSSE
          );
        } else {
          console.log("Token refresh failed:", refreshResult.error);
          return {
            status: 401,
            message: refreshResult.error || "Token expired",
            shouldRedirect: true,
          };
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
        return {
          status: 401,
          message: error.message || "Token refresh failed",
          shouldRedirect: true,
        };
      }
    }
  }

  // Xử lý response body theo type yêu cầu
  let data;

  try {
    switch (typeResponse) {
      case "blob":
        data = await response.blob();
        break;
      case "body":
        data = response.body;
        break;
      case "text":
        data = await response.text();
        break;
      case "stream":
        data = response.body;
        break;
      default:
        // Tự động detect JSON hoặc fallback text
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            data = await response.json();
          } catch (jsonError) {
            // JSON parse error: log chi tiết và fallback
            console.error("JSON parse error:", {
              error: jsonError.message,
              status: response.status,
              url: url,
              contentType: contentType
            });
            
            // Fallback to text và đánh dấu lỗi parse
            const textData = await response.text();
            data = {
              _parseError: true,
              _originalText: textData,
              _error: jsonError.message,
              _status: response.status
            };
          }
        } else {
          data = await response.text();
        }
        break;
    }
  } catch (error) {
    // Lỗi khi đọc response body
    console.error("Error reading response body:", error);
    data = {
      _readError: true,
      _error: error.message,
      _status: response.status
    };
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
    headers: response.headers, // Thêm headers để có thể sử dụng
  };
};

/**
 * HTTP Client cho Server-Sent Events (SSE)
 * Tự động thiết lập headers phù hợp cho streaming
 */
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
    false, // isRetry
    null, // searchParams
    "Vui lòng đăng nhập!",
    "stream",
    signal,
    true // isSSE = true
  );
};

/**
 * HTTP Client cho file downloads (blob response)
 * Tối ưu cho việc tải xuống file
 */
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