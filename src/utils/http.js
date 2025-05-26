"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const httpClient = async (url, customHeaders = {}, body = {}, method = "GET", hasPrefixHeader = true, isRefresh = false, searchParams, msg = "Vui lòng đăng nhập!") => {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Ensure URL is absolute
    let fullUrl = url;
    if (!url.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_ENDPOINT_URL || process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error('Base URL not configured');
      }
      fullUrl = baseUrl.endsWith('/') || url.startsWith('/') 
        ? baseUrl + url.replace(/^\//, '') 
        : baseUrl + '/' + url;
    }

    const options = {
      cache: "no-cache",
      headers: {
        ...customHeaders,
      },
      method,
    };

    // Add prefix header if needed
    if (hasPrefixHeader && process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY && process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE) {
      options.headers[process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY] = process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE;
    }

    // Handle body data
    if (body instanceof FormData) {
      options.body = body;
    } else if (Object.keys(body).length > 0) {
      if (method === "GET") {
        const searchParams = new URLSearchParams(body);
        fullUrl = fullUrl + (fullUrl.includes('?') ? '&' : '?') + searchParams.toString();
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    options.signal = controller.signal;

    const response = await fetch(fullUrl, options);
    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok && response.status >= 500) {
      return serverError();
    }

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      data = {
        status: response.status,
        message: text || 'No response data',
        data: null
      };
    }

    // Handle 401 unauthorized
    if (data.status === 401 || response.status === 401) {
      if (!isRefresh) {
        const refreshToken = cookies().get('refreshToken')?.value;
        if (refreshToken) {
          try {
            const refreshUrl = (process.env.NEXT_PUBLIC_ENDPOINT_URL || process.env.NEXT_PUBLIC_API_URL) + "auth/refresh-token";
            const refreshResponse = await fetch(refreshUrl, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY || "123456",
              },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.status === 200 && refreshData.data?.accessToken) {
                // Set new tokens
                cookies().set({ 
                  name: "token", 
                  value: refreshData.data.accessToken, 
                  httpOnly: true, 
                  secure: process.env.NODE_ENV === 'production', 
                  path: "/", 
                  sameSite: "strict" 
                });
                cookies().set({ 
                  name: "refreshToken", 
                  value: refreshData.data.refreshToken, 
                  httpOnly: true, 
                  secure: process.env.NODE_ENV === 'production', 
                  path: "/", 
                  sameSite: "strict" 
                });

                // Retry original request with new token
                return await httpClient(url, {
                  ...customHeaders,
                  'Authorization': `Bearer ${refreshData.data.accessToken}`
                }, body, method, hasPrefixHeader, true, searchParams, msg);
              }
            }
          } catch (refreshError) {
            console.error('Refresh token error:', refreshError);
          }
        }
        return clearTokensAndRedirect();
      }
      
      return {
        ...data,
        searchParams,
        message: msg
      };
    }

    return data;

  } catch (error) {
    console.error('HTTP Client Error:', error);
    
    // Handle specific error types
    if (error.name === 'AbortError') {
      return {
        status: 408,
        message: 'Request timeout',
        errorMessage: 'Request timed out after 30 seconds',
        searchParams
      };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return serverError();
    }

    if (error.message.includes('fetch')) {
      return {
        status: 500,
        message: 'Không thể kết nối đến server',
        errorMessage: error.message,
        searchParams
      };
    }

    return {
      status: 400,
      message: msg,
      errorMessage: error.message,
      searchParams
    };
  }
};

function clearTokensAndRedirect() {
  cookies().delete('token');
  cookies().delete('refreshToken');
  cookies().set('msg', 'Vui lòng đăng nhập!');
  return redirect('/dang-nhap');
}

function serverError() {
  cookies().delete('token');
  cookies().delete('refreshToken');
  cookies().set('msg', 'SERVER LỖI');
  return redirect('/dang-nhap');
}

function handleLoginRedirect(msg = "Vui lòng đăng nhập!", searchParams) {
  cookies().set('msg', msg);
  return redirect('/dang-nhap' + (searchParams ? '?' + searchParams : ''));
}