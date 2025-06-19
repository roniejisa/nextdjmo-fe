import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Constants
const CONFIG = {
  AUTH_BASE_URL: process.env.NEXT_PUBLIC_ENDPOINT_URL + "auth",
  API_KEY: process.env.API_KEY || "123456",
  URL_LOGIN: "/dang-nhap",
  DEFAULT_LANG: "vi",
  LANGUAGES: ["en", "vi"],
  REQUIRE_ROUTES: ["/system", "/dang-nhap"],
  CACHE_MAX_SIZE: 500,
  CACHE_TTL_BUFFER: 10, // seconds buffer before expiry
  TOKEN_EXPIRES: 60 * 60 * 24, // 24 hours
  REFRESH_TOKEN_EXPIRES: 60 * 60 * 24 * 30, // 30 days
  REF_COOKIE_EXPIRES: 60 * 60 * 24 * 30, // 30 days
};

// Enhanced in-memory cache with LRU eviction
class TokenCache {
  constructor(maxSize = CONFIG.CACHE_MAX_SIZE) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Math.floor(Date.now() / 1000);
    if (item.expiresAt <= now + CONFIG.CACHE_TTL_BUFFER) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item;
  }

  set(key, value) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  cleanup() {
    const now = Math.floor(Date.now() / 1000);
    const keysToDelete = [];

    for (const [key, value] of this.cache.entries()) {
      if (value.expiresAt <= now) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`[TokenCache] Cleaned up ${keysToDelete.length} expired entries`);
    }

    return keysToDelete.length;
  }

  size() {
    return this.cache.size;
  }
}

const tokenCache = new TokenCache();

// Utility functions
const createCacheKey = (token) => `token_${token.slice(-20)}`;

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

const makeid = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
};

const extractSocialAuthParams = (url) => {
  const socialToken = url.searchParams.get("token");
  const socialRefreshToken = url.searchParams.get("refreshToken");
  const newCustomer = url.searchParams.get("created");

  return {
    socialToken,
    socialRefreshToken,
    newCustomer,
    isOauth: !!newCustomer,
  };
};

const getLanguage = (request) => {
  const pathname = request.nextUrl.pathname;
  return CONFIG.LANGUAGES.find(lang => lang === pathname.split("/")[1]) ?? CONFIG.DEFAULT_LANG;
};

const shouldSkipMiddleware = (pathname, method) => {
  // Skip for API routes and static files
  if (pathname.startsWith("/api/") && pathname.includes(".")) return true;
  if (method !== "GET") return true;
  
  // Skip for paths that don't require authentication
  const isPathNotCheck = CONFIG.REQUIRE_ROUTES.every(route => !pathname.startsWith(route));
  return isPathNotCheck;
};

// Enhanced cookie management
const deleteAuthCookies = (response) => {
  const cookiesToDelete = ["token", "refreshToken", "logged"];
  cookiesToDelete.forEach(name => response.cookies.delete(name));
  return response;
};

const setAuthCookies = (response, { accessToken, refreshToken, isAuthenticated }) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "strict",
  };

  if (accessToken && isAuthenticated) {
    response.cookies.set("token", accessToken, {
      ...cookieOptions,
      maxAge: CONFIG.TOKEN_EXPIRES,
    });
  }

  if (refreshToken && isAuthenticated) {
    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: CONFIG.REFRESH_TOKEN_EXPIRES,
    });
  }

  if (isAuthenticated) {
    response.cookies.set("logged", "OK", {
      ...cookieOptions,
      httpOnly: false,
    });
  }
};

// Enhanced authentication with better error handling
const authenticate = async (request, token = null, refreshToken = null, isRefresh = false, isOauth = false) => {
  const method = request.method;
  const isSocial = isOauth && token;

  // Get tokens from cookies if not provided
  token = token || request.cookies.get("token")?.value;
  refreshToken = refreshToken || request.cookies.get("refreshToken")?.value;

  // Verify current token
  if (token) {
    const cacheKey = createCacheKey(token);
    const cached = tokenCache.get(cacheKey);
    
    if (cached) {
      console.log("[Auth] Using cached token verification");
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
      const verifyResponse = await fetch(`${CONFIG.AUTH_BASE_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-API-KEY": CONFIG.API_KEY,
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        
        if (verifyResult?.status === 200 && verifyResult?.data?.valid) {
          const userData = {
            userId: verifyResult.data.user_id,
            username: verifyResult.data.username,
            expiresAt: verifyResult.data.expires_at,
            cachedAt: getCurrentTimestamp(),
          };

          tokenCache.set(cacheKey, userData);
          
          // Periodic cleanup
          if (tokenCache.size() > CONFIG.CACHE_MAX_SIZE * 0.8) {
            tokenCache.cleanup();
          }

          console.log("[Auth] Token verified and cached");
          return {
            isAuthenticated: true,
            userId: userData.userId,
            username: userData.username,
            accessToken: token,
            refreshToken,
            isSocial,
          };
        }
      } else if (verifyResponse.status === 401) {
        console.log("[Auth] Token expired or invalid");
        tokenCache.delete(cacheKey);
      } else {
        console.log(`[Auth] Verify failed with status: ${verifyResponse.status}`);
      }
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.error("[Auth] Token verification timeout");
      } else {
        console.error("[Auth] Token verify error:", error.message);
      }
    }
  }

  // Attempt token refresh for GET requests
  if (refreshToken && !isRefresh && method === "GET") {
    try {
      const refreshResponse = await fetch(`${CONFIG.AUTH_BASE_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "X-API-KEY": CONFIG.API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(5000),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        if (refreshData?.status === 200 && refreshData?.data) {
          const { accessToken, refreshToken: newRefreshToken } = refreshData.data;
          console.log("[Auth] Token refreshed successfully");

          return await authenticate(request, accessToken, newRefreshToken, true, isOauth);
        }
      } else if (refreshResponse.status === 401) {
        console.log("[Auth] Refresh token expired or invalid");
      }
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.error("[Auth] Token refresh timeout");
      } else {
        console.error("[Auth] Refresh token error:", error.message);
      }
    }
  }

  return { isAuthenticated: false, isSocial, shouldClearTokens: true };
};

// Enhanced response creation
const createResponse = (authResult, request, language) => {
  const {
    userId,
    username,
    accessToken,
    refreshToken,
    isAuthenticated,
    isSocial,
    newCustomer,
    shouldClearTokens = false
  } = authResult;

  const headers = new Headers();
  headers.set("Cache-Control", "no-store, must-revalidate");

  // Set user info headers for authenticated users
  if (isAuthenticated && userId) {
    headers.set("userId", userId);
    headers.set("username", username || "");
  }

  let response;

  // Handle social authentication redirects
  if (isSocial) {
    const redirectUrl = isAuthenticated 
      ? (newCustomer ? "/account/profile" : "/")
      : CONFIG.URL_LOGIN;
    
    response = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    if (!isAuthenticated) {
      response.cookies.set("msg", "Đăng nhập không thành công!", {
        httpOnly: false,
        sameSite: "Strict",
      });
    }
  } else {
    response = NextResponse.next({ request: { headers } });
  }

  // Handle token management
  if (shouldClearTokens) {
    deleteAuthCookies(response);
  } else {
    setAuthCookies(response, { accessToken, refreshToken, isAuthenticated });
  }

  // Set session ID and language
  const cookieStore = cookies();
  const ssId = cookieStore.has("ssId") ? cookieStore.get("ssId").value : makeid(12);
  
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set("ssId", ssId, {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "strict",
  });

  response.cookies.set("lang", language, {
    httpOnly: true,
    secure: isProduction,
    path: "/",
    sameSite: "strict",
  });

  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
};

// Main middleware function
export async function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const method = request.method;

  // Early exit for paths that don't need middleware
  if (shouldSkipMiddleware(pathname, method)) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    return response;
  }

  // Extract social auth parameters for homepage
  const socialAuth = pathname === "/" ? extractSocialAuthParams(url) : {};
  const { socialToken, socialRefreshToken, isOauth, newCustomer } = socialAuth;

  try {
    // Authenticate user
    const authResult = await authenticate(request, socialToken, socialRefreshToken, false, isOauth);
    const { isAuthenticated, shouldClearTokens } = authResult;

    // Handle login page access
    if (pathname === CONFIG.URL_LOGIN) {
      if (isAuthenticated) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.headers.set("Cache-Control", "no-store, must-revalidate");
        return response;
      }

      // Set referrer cookie for post-login redirect
      const response = NextResponse.next();
      const cookieStore = cookies();
      const ref = cookieStore.has("ref") 
        ? cookieStore.get("ref").value 
        : url.searchParams.get("ref");
      
      if (ref) {
        response.cookies.set("ref", ref, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "strict",
          maxAge: CONFIG.REF_COOKIE_EXPIRES,
        });
      }

      response.headers.set("Cache-Control", "no-store, must-revalidate");
      deleteAuthCookies(response);
      return response;
    }

    // Check protected routes
    const isProtectedRoute = CONFIG.REQUIRE_ROUTES.some(route => pathname.startsWith(route));
    if (isProtectedRoute && !isAuthenticated) {
      const response = NextResponse.redirect(new URL(CONFIG.URL_LOGIN, request.url));
      response.headers.set("Cache-Control", "no-store, must-revalidate");
      deleteAuthCookies(response);
      return response;
    }

    // Create and return response
    const language = getLanguage(request);
    return createResponse({
      ...authResult,
      newCustomer,
      shouldClearTokens
    }, request, language);

  } catch (error) {
    console.error("[Middleware] Authentication error:", error.message);

    // Fallback response with proper cleanup
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    deleteAuthCookies(response);

    // Redirect protected routes to login on error
    const isProtectedRoute = CONFIG.REQUIRE_ROUTES.some(route => pathname.startsWith(route));
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL(CONFIG.URL_LOGIN, request.url));
    }

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
  ],
};