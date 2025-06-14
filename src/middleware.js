import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// ==================== CONSTANTS ====================
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth";
const API_KEY = process.env.API_KEY || "123456";
const URL_LOGIN = "/dang-nhap";
const DEFAULT_LANG = "vi";
const LANGUAGES = ["en", "vi"];
const FETCH_TIMEOUT = 30000; // 5 seconds timeout
const PROTECTED_ROUTES = ["/system"];

// ==================== GLOBAL REFRESH TOKEN MANAGEMENT ====================
/**
 * Global object để quản lý refresh token promises
 * Key: refreshToken, Value: Promise đang thực hiện refresh
 */
const refreshPromises = new Map();

/**
 * Timeout để cleanup promises cũ (tránh memory leak)
 */
const REFRESH_PROMISE_TIMEOUT = 10000; // 10 seconds

// ==================== UTILITY FUNCTIONS ====================

/**
 * Xóa tất cả authentication cookies
 * @param {NextResponse} response - Response object để modify cookies
 * @returns {NextResponse} Response với cookies đã bị xóa
 */
function clearAuthCookies(response) {
  response.cookies.delete("token");
  response.cookies.delete("refreshToken");
  response.cookies.delete("logged");
  return response;
}

/**
 * Tạo session ID ngẫu nhiên
 * @param {number} length - Độ dài của ID
 * @returns {string} Random session ID
 */
function generateSessionId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Lấy ngôn ngữ từ URL path
 * @param {Request} request - Next.js request object
 * @returns {string} Language code (vi hoặc en)
 */
function getLanguageFromPath(request) {
  const pathname = request.nextUrl.pathname;
  const pathLanguage = pathname.split("/")[1];
  return LANGUAGES.includes(pathLanguage) ? pathLanguage : DEFAULT_LANG;
}

/**
 * Trích xuất thông tin OAuth từ URL parameters
 * @param {URL} url - URL object từ request
 * @returns {Object} Object chứa thông tin OAuth
 */
function extractOAuthParams(url) {
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

/**
 * Cleanup expired refresh promises để tránh memory leak
 */
function cleanupExpiredPromises() {
  const now = Date.now();
  for (const [key, promiseData] of refreshPromises.entries()) {
    if (now - promiseData.timestamp > REFRESH_PROMISE_TIMEOUT) {
      refreshPromises.delete(key);
    }
  }
}

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Verify token bằng cách gọi API profile
 * @param {string} token - Access token cần verify
 * @returns {Promise<Object|null>} User profile nếu token hợp lệ, null nếu không
 */
async function verifyToken(token) {
  if (!token) return null;

  try {
    const response = await fetch(AUTH_BASE_URL + "/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      console.log(`Token verification failed with status: ${response.status}`);
      return null;
    }

    const profile = await response.json();

    if (profile && profile.status === 200 && profile.data) {
      return profile.data;
    }

    return null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Refresh access token sử dụng refresh token (internal function)
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object|null>} Object chứa tokens mới hoặc null nếu thất bại
 */
async function _refreshAccessToken(refreshToken) {
  if (!refreshToken) return null;

  try {
    const response = await fetch(AUTH_BASE_URL + "/refresh-token", {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      console.log(`Token refresh failed with status: ${response.status}`);
      return null;
    }

    const refreshData = await response.json();

    if (refreshData && refreshData.status === 200 && refreshData.data) {
      const { accessToken, refreshToken: newRefreshToken } = refreshData.data;
      console.log("Token refreshed successfully");
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    }

    return null;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
}

/**
 * Refresh access token với promise management để tránh duplicate requests
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object|null>} Object chứa tokens mới hoặc null nếu thất bại
 */
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) return null;

  // Cleanup expired promises trước khi xử lý
  cleanupExpiredPromises();

  // Kiểm tra xem có promise nào đang refresh token này không
  if (refreshPromises.has(refreshToken)) {
    console.log("Refresh token request already in progress, waiting...");
    const existingPromise = refreshPromises.get(refreshToken);

    try {
      // Đợi promise hiện tại hoàn thành
      const result = await existingPromise.promise;
      return result;
    } catch (error) {
      // Nếu promise bị lỗi, xóa khỏi map và thử lại
      refreshPromises.delete(refreshToken);
      console.error("Existing refresh promise failed:", error);
      return null;
    }
  }

  // Tạo promise mới cho refresh token
  const refreshPromise = _refreshAccessToken(refreshToken);

  // Lưu promise vào map với timestamp
  refreshPromises.set(refreshToken, {
    promise: refreshPromise,
    timestamp: Date.now(),
  });

  try {
    const result = await refreshPromise;

    // Xóa promise khỏi map khi hoàn thành
    refreshPromises.delete(refreshToken);

    return result;
  } catch (error) {
    // Xóa promise khỏi map khi có lỗi
    refreshPromises.delete(refreshToken);
    throw error;
  }
}

/**
 * Xác thực người dùng - hàm chính xử lý authentication logic
 * @param {Request} request - Next.js request object
 * @param {string|null} providedToken - Token được cung cấp từ OAuth
 * @param {string|null} providedRefreshToken - Refresh token từ OAuth
 * @param {boolean} isOauth - Có phải OAuth login không
 * @returns {Promise<Object>} Kết quả authentication
 */
async function authenticate(
  request,
  providedToken = null,
  providedRefreshToken = null,
  isOauth = false
) {
  const method = request.method;

  // Lấy tokens từ parameters hoặc cookies
  const token = providedToken || request.cookies.get("token")?.value;
  const refreshToken =
    providedRefreshToken || request.cookies.get("refreshToken")?.value;

  // Bước 1: Verify token hiện tại
  const user = await verifyToken(token);
  if (user) {
    return {
      isAuthenticated: true,
      user,
      accessToken: token,
      refreshToken,
      isSocial: isOauth,
      shouldClearTokens: false,
      tokensUpdated: false,
    };
  }

  // Bước 2: Nếu token không hợp lệ và có refresh token, thử refresh
  // Chỉ refresh cho GET requests để tránh side effects
  if (refreshToken && method === "GET") {
    try {
      const newTokens = await refreshAccessToken(refreshToken);

      if (newTokens) {
        // Verify token mới
        const newUser = await verifyToken(newTokens.accessToken);

        if (newUser) {
          return {
            isAuthenticated: true,
            user: newUser,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            isSocial: isOauth,
            shouldClearTokens: false,
            tokensUpdated: true, // Flag để biết cần update cookies
          };
        }
      }
    } catch (error) {
      console.error("Token refresh process failed:", error);
      // Continue to authentication failure
    }
  }

  // Bước 3: Authentication thất bại
  return {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isSocial: isOauth,
    shouldClearTokens: true,
    tokensUpdated: false,
  };
}

// ==================== RESPONSE HANDLING ====================

/**
 * Tạo response với cookies và headers phù hợp
 * @param {Object} authResult - Kết quả từ authenticate function
 * @param {Request} request - Original request
 * @returns {NextResponse} Response đã được config
 */
function createAuthResponse(authResult, request) {
  const {
    isAuthenticated,
    user,
    accessToken,
    refreshToken,
    isSocial,
    newCustomer,
    shouldClearTokens,
    tokensUpdated,
  } = authResult;

  // Setup headers
  const headers = new Headers();
  if (user) {
    headers.set("user", encodeURIComponent(JSON.stringify(user)));
  }

  let response;

  // Xử lý OAuth redirect
  if (isSocial) {
    if (!isAuthenticated) {
      response = NextResponse.redirect(new URL(URL_LOGIN, request.url));
      response.cookies.set("msg", "Đăng nhập không thành công!", {
        httpOnly: false,
        sameSite: "Strict",
      });
    } else {
      // Redirect đến profile nếu là user mới, về home nếu là user cũ
      const redirectUrl = newCustomer ? "/account/profile" : "/";
      response = NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } else {
    // Request thông thường
    response = NextResponse.next({
      request: { headers },
    });
  }

  // Xử lý cookies
  if (shouldClearTokens) {
    clearAuthCookies(response);
  } else if (isAuthenticated || tokensUpdated) {
    // Set access token
    if (accessToken) {
      response.cookies.set("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    // Set refresh token
    if (refreshToken) {
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Set logged flag
    if (isAuthenticated) {
      response.cookies.set("logged", "OK", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
      });
    }
  }

  // Set session ID (cho tracking, analytics, etc.)
  const cookieStore = cookies();
  const sessionId = cookieStore.has("ssId")
    ? cookieStore.get("ssId").value
    : generateSessionId(12);

  response.cookies.set("ssId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  // Set language cookie
  const language = getLanguageFromPath(request);
  response.cookies.set("lang", language, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
  });

  // Prevent caching để đảm bảo middleware luôn chạy
  response.headers.set("Cache-Control", "no-store, must-revalidate");

  return response;
}

function getModuleInfo(path) {
  const afterSystem = path.split("/system/")[1];
  if (!afterSystem) return null;

  const segments = afterSystem.split("/");
  return {
    module: segments[0],
    isDetailPage: segments.length >= 2,
    isCreatePage: segments.length >= 2 && segments[1] == 'create',
  };
}

// Helper function to check if user has required permission
function hasRequiredPermission(permissions, moduleInfo) {
  if (!moduleInfo) {
    return permissions.some((permission) => permission.includes("read"));
  }

  const { module, isDetailPage, isCreatePage } = moduleInfo;
  if (isCreatePage) {
    // For detail pages, need edit or update permission
    return (
      permissions.includes(`${module}.create`) ||
      permissions.includes(`${module}.add`)
    );
  } else if (isDetailPage) {
    return (
      permissions.includes(`${module}.edit`) ||
      permissions.includes(`${module}.update`)
    );
  } else {
    // For list pages, need read permission
    return permissions.includes(`${module}.read`);
  }
}

// Helper function to redirect to login
function redirectToLogin(request) {
  const response = NextResponse.redirect(new URL(URL_LOGIN, request.url));
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  clearAuthCookies(response);
  return response;
}

// Main permission check logic
function checkPermissionAndRedirect(
  isProtectedRoute,
  authResult,
  path,
  request
) {
  // If not a protected route, allow access
  if (!isProtectedRoute) {
    return null; // No redirect needed
  }

  // If protected route but not authenticated, redirect to login
  if (!authResult.isAuthenticated) {
    return redirectToLogin(request);
  }

  // If authenticated, check specific permissions
  const moduleInfo = getModuleInfo(path);
  const { permissions } = authResult.user;
  const hasPermission = hasRequiredPermission(permissions, moduleInfo);

  if (!hasPermission) {
    return redirectToLogin(request);
  }

  // All checks passed, allow access
  return null;
}

// ==================== MAIN MIDDLEWARE FUNCTION ====================

/**
 * Main middleware function - điểm vào chính của middleware
 * @param {Request} request - Next.js request object
 * @returns {Promise<NextResponse>} Response cho request
 */
export async function middleware(request) {
  const { nextUrl, method } = request;
  const pathname = nextUrl.pathname;

  // Skip middleware cho các paths không cần thiết
  if (method !== "GET" || pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
  }

  try {
    // Trích xuất OAuth params nếu có
    let oauthData = {};
    if (pathname === "/") {
      oauthData = extractOAuthParams(nextUrl);
    }

    const { socialToken, socialRefreshToken, isOauth, newCustomer } = oauthData;

    // Thực hiện authentication
    const authResult = await authenticate(
      request,
      socialToken,
      socialRefreshToken,
      isOauth
    );

    // Xử lý trang login
    if (pathname === URL_LOGIN) {
      if (authResult.isAuthenticated) {
        // User đã login, redirect về home
        const response = NextResponse.redirect(new URL("/", request.url));
        response.headers.set("Cache-Control", "no-store, must-revalidate");
        return response;
      }

      // Xử lý referral parameter
      const response = NextResponse.next();
      const cookieStore = cookies();
      const ref = cookieStore.has("ref")
        ? cookieStore.get("ref").value
        : nextUrl.searchParams.get("ref");

      if (ref) {
        response.cookies.set("ref", ref, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      response.headers.set("Cache-Control", "no-store, must-revalidate");
      clearAuthCookies(response);
      return response;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    // Kiểm tra protected routes
    const redirectResponse = checkPermissionAndRedirect(
      isProtectedRoute,
      authResult,
      pathname,
      request
    );
    if (redirectResponse) {
      return redirectResponse;
    }

    // Tạo response với auth data
    return createAuthResponse(
      {
        ...authResult,
        newCustomer,
      },
      request
    );
  } catch (error) {
    console.error("Middleware error:", error);

    // Fallback response khi có lỗi
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    clearAuthCookies(response);

    // Redirect protected routes về login khi có lỗi
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(URL_LOGIN, request.url));
    }

    return response;
  }
}

// ==================== MIDDLEWARE CONFIG ====================

export const config = {
  matcher: [
    /*
     * Match tất cả request paths trừ:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest files, service worker
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
  ],
};
