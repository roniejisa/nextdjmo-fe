"use server";

import { cookies } from "next/headers";
import { refreshTokens } from "./action";

// Session-based state management để tránh memory leak
const refreshStates = new Map();
const MAX_REFRESH_ATTEMPTS = 2;
const REQUEST_TIMEOUT = 60000; // 10 seconds
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

/**
 * Lấy hoặc tạo refresh state cho session
 * @param {string} sessionId - ID của session
 * @returns {Object} State object chứa refreshing status
 */
const getRefreshState = (sessionId) => {
  if (!refreshStates.has(sessionId)) {
    refreshStates.set(sessionId, {
      refreshPromise: null,
      refreshFailCount: 0,
      lastActivity: Date.now()
    });
  }
  
  // Update last activity
  const state = refreshStates.get(sessionId);
  state.lastActivity = Date.now();
  return state;
};

/**
 * Cleanup các session cũ để tránh memory leak
 */
const cleanupOldSessions = () => {
  const now = Date.now();
  const cutoff = now - CLEANUP_INTERVAL;
  
  for (const [sessionId, state] of refreshStates.entries()) {
    if (state.lastActivity < cutoff) {
      refreshStates.delete(sessionId);
    }
  }
};

// Periodic cleanup - chạy mỗi 30 phút
if (typeof global !== 'undefined') {
  setInterval(cleanupOldSessions, CLEANUP_INTERVAL);
}

/**
 * Fetch với timeout support
 * @param {string} url - URL để fetch
 * @param {Object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>} Response object
 */
const fetchWithTimeout = async (url, options, timeoutMs = REQUEST_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server không phản hồi');
    }
    throw error;
  }
};

/**
 * Phân loại và xử lý lỗi response
 * @param {Response} response - Response object
 * @param {Object} data - Parsed response data
 * @returns {Object} Error categorization
 */
const categorizeError = (response, data) => {
  // Network errors
  if (!response || !response.ok) {
    return { 
      type: 'NETWORK_ERROR', 
      retryable: true,
      message: 'Lỗi kết nối mạng'
    };
  }
  
  // Server error codes
  switch (data?.status) {
    case 401:
      return { 
        type: 'AUTH_ERROR', 
        retryable: false,
        message: 'Phiên đăng nhập hết hạn'
      };
    case 403:
      return { 
        type: 'PERMISSION_ERROR', 
        retryable: false,
        message: 'Không có quyền truy cập'
      };
    case 429:
      return { 
        type: 'RATE_LIMIT', 
        retryable: true,
        message: 'Quá nhiều requests, vui lòng thử lại sau'
      };
    case 500:
    case 502:
    case 503:
      return { 
        type: 'SERVER_ERROR', 
        retryable: true,
        message: 'Lỗi server, vui lòng thử lại'
      };
    default:
      return { 
        type: 'CLIENT_ERROR', 
        retryable: false,
        message: data?.message || 'Có lỗi xảy ra'
      };
  }
};

/**
 * Xử lý token refresh với race condition protection
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Refresh result
 */
const handleTokenRefresh = async (sessionId) => {
  const state = getRefreshState(sessionId);
  
  // Kiểm tra số lần thử refresh
  if (state.refreshFailCount >= MAX_REFRESH_ATTEMPTS) {
    console.log(`[Auth] Max refresh attempts reached for session: ${sessionId}`);
    return {
      success: false,
      shouldRedirect: true,
      message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
    };
  }
  
  // Nếu đang refresh, chờ kết quả
  if (state.refreshPromise) {
    console.log(`[Auth] Waiting for existing refresh process: ${sessionId}`);
    try {
      return await state.refreshPromise;
    } catch (error) {
      console.error(`[Auth] Error waiting for refresh: ${error.message}`);
      state.refreshFailCount++;
      return {
        success: false,
        shouldRedirect: true,
        message: "Lỗi làm mới token"
      };
    }
  }
  
  // Bắt đầu refresh process
  console.log(`[Auth] Starting token refresh for session: ${sessionId}`);
  state.refreshPromise = refreshTokens()
    .then(result => {
      // Reset promise sau khi hoàn thành
      state.refreshPromise = null;
      
      if (result && result.success && result.newToken) {
        // Reset fail count khi thành công
        state.refreshFailCount = 0;
        console.log(`[Auth] Token refresh successful: ${sessionId}`);
        return {
          success: true,
          newToken: result.newToken,
          shouldRedirect: false
        };
      } else {
        // Refresh thất bại
        state.refreshFailCount++;
        console.log(`[Auth] Token refresh failed: ${sessionId}`);
        return {
          success: false,
          shouldRedirect: true,
          message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        };
      }
    })
    .catch(error => {
      // Reset promise và tăng fail count
      state.refreshPromise = null;
      state.refreshFailCount++;
      console.error(`[Auth] Token refresh error: ${error.message}`);
      return {
        success: false,
        shouldRedirect: true,
        message: "Lỗi làm mới token"
      };
    });
  
  return await state.refreshPromise;
};

/**
 * Retry logic với exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @returns {Promise} Result of function
 */
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      // Không retry cho auth errors
      if (error.type === 'AUTH_ERROR' || error.type === 'PERMISSION_ERROR') {
        throw error;
      }
      
      // Retry cho network và server errors
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      console.log(`[HTTP] Retrying request in ${delay}ms (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Logging cho development
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} status - Response status
 * @param {number} startTime - Request start time
 */
const logRequest = (method, url, status, startTime) => {
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime;
    console.log(`[HTTP] ${method} ${url} - ${status} (${duration}ms)`);
  }
};

/**
 * HTTP Client với token refresh, retry logic và error handling
 * @param {string} url - API endpoint URL
 * @param {Object} customHeaders - Custom headers to add
 * @param {Object|FormData} body - Request body
 * @param {string} method - HTTP method
 * @param {boolean} hasPrefixHeader - Whether to add prefix header
 * @param {boolean} isRetry - Whether this is a retry request
 * @param {URLSearchParams} searchParams - Search parameters
 * @param {string} msg - Error message fallback
 * @returns {Promise<Object>} API response
 */
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
  const startTime = Date.now();
  const sessionId = cookies().get("sessionId")?.value || cookies().get("token")?.value || "default";
  
  try {
    // Chuẩn bị request options
    const options = {
      cache: "no-store",
      headers: {
        ...customHeaders,
      },
      method,
    };

    // Thêm token vào headers nếu có
    if (!isRetry) {
      const token = cookies().get("token")?.value;
      if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Thêm prefix header nếu cần
    if (hasPrefixHeader) {
      options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] =
        process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
    }

    // Xử lý request body
    if (Object.keys(body).length > 0) {
      if (method === "GET") {
        // Chuyển body thành query parameters cho GET request
        const searchParams = new URLSearchParams(body);
        url = url + "?" + searchParams.toString();
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    } else if (body instanceof FormData) {
      // FormData tự động set Content-Type
      options.body = body;
    }

    // Thực hiện request với timeout
    const response = await fetchWithTimeout(url, options);
    
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      // Xử lý trường hợp response không phải JSON
      console.error("[HTTP] JSON parse error:", parseError);
      logRequest(method, url, response.status, startTime);
      return {
        status: response.status,
        message: "Lỗi xử lý phản hồi từ server",
        errorMessage: parseError.message,
      };
    }

    // Log request
    logRequest(method, url, data.status || response.status, startTime);

    // Xử lý 401 - Token expired
    if (data.status === 401 && !isRetry) {
      console.log(`[Auth] Token expired, attempting refresh for session: ${sessionId}`);
      
      const refreshResult = await handleTokenRefresh(sessionId);
      
      if (refreshResult.success && refreshResult.newToken) {
        // Retry request với token mới
        console.log(`[Auth] Retrying request with new token: ${sessionId}`);
        return await httpClient(
          url,
          {
            ...customHeaders,
            Authorization: `Bearer ${refreshResult.newToken}`,
          },
          body,
          method,
          hasPrefixHeader,
          true, // isRetry = true
          searchParams,
          msg
        );
      } else {
        // Refresh thất bại, redirect về login
        console.log(`[Auth] Token refresh failed, redirecting to login: ${sessionId}`);
        return {
          status: 401,
          message: refreshResult.message,
          shouldRedirect: refreshResult.shouldRedirect,
        };
      }
    }

    // Reset refresh fail count khi request thành công
    if (data.status === 200 || (data.status >= 200 && data.status < 400)) {
      const state = refreshStates.get(sessionId);
      if (state) {
        state.refreshFailCount = 0;
      }
    }

    return data;
    
  } catch (error) {
    console.error("[HTTP] Request error:", error);
    logRequest(method, url, 'ERROR', startTime);
    
    // Phân loại lỗi
    const errorInfo = categorizeError(null, null);
    
    return {
      status: 500,
      message: errorInfo.message,
      errorMessage: error.message,
      searchParams,
      retryable: errorInfo.retryable
    };
  }
};

/**
 * HTTP Client wrapper với retry logic
 * @param {...args} args - Arguments to pass to httpClient
 * @returns {Promise<Object>} API response
 */
export const httpClientWithRetry = async (...args) => {
  return await retryWithBackoff(() => httpClient(...args));
};