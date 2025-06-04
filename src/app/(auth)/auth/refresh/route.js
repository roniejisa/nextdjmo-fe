import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
};

export async function POST(request) {
  try {
    // Lấy refresh token từ request body hoặc cookies
    const body = await request.json();
    const refreshToken = body.refreshToken || cookies().get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          status: HTTP_STATUS.UNAUTHORIZED, 
          message: "No refresh token provided" 
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    console.log("🔄 Starting token refresh via API route...");

    // Gọi API refresh token
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ENDPOINT_URL}auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [process.env.NEXT_PUBLIC_PREFIX_HEADER_KEY]: process.env.NEXT_PUBLIC_PREFIX_HEADER_VALUE,
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-cache",
      }
    );

    const data = await response.json();
    
    // FIX: Kiểm tra HTTP response status trước
    if (!response.ok) {
      console.error("❌ External API returned error:", {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      return NextResponse.json(
        {
          status: response.status === 401 ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.SERVER_ERROR,
          message: "Token refresh failed from external API",
          error: data
        },
        { status: response.status === 401 ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.SERVER_ERROR }
      );
    }

    // Kiểm tra response data
    if (data.status === HTTP_STATUS.OK && data.data) {
      console.log("✅ Token refresh successful via API route");

      // Set cookies trong API route
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: "/",
        sameSite: "strict",
      };

      const responseObj = NextResponse.json({
        status: HTTP_STATUS.OK,
        message: "Token refreshed successfully",
        data: {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        }
      });

      // Set cookies vào response
      responseObj.cookies.set({
        name: "token",
        value: data.data.accessToken,
        ...cookieOptions,
        maxAge: 60 * 15, // 15 minutes
      });

      responseObj.cookies.set({
        name: "refreshToken", 
        value: data.data.refreshToken,
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      console.log("🍪 Cookies updated via API route");
      return responseObj;
    }

    // Trường hợp data.status không phải 200
    console.error("❌ Token refresh failed - invalid response:", data);
    return NextResponse.json(
      {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: "Token refresh failed - invalid response from server",
        error: data
      },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );

  } catch (error) {
    console.error("❌ API route refresh error:", error);
    return NextResponse.json(
      {
        status: HTTP_STATUS.SERVER_ERROR,
        message: "Internal server error during token refresh",
        error: error.message
      },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}

// Endpoint để clear tokens (logout)
export async function DELETE() {
  try {
    console.log("🚪 Clearing tokens via API route");

    const response = NextResponse.json({
      status: HTTP_STATUS.OK,
      message: "Tokens cleared successfully"
    });

    // Clear cookies với các options phù hợp
    const clearOptions = {
      path: "/",
      maxAge: 0, // Expire immediately
    };

    response.cookies.set("token", "", clearOptions);
    response.cookies.set("refreshToken", "", clearOptions);
    response.cookies.set("msg", "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", {
      path: "/",
      maxAge: 60 * 5, // 5 minutes for the message
    });

    return response;
  } catch (error) {
    console.error("❌ Clear tokens error:", error);
    return NextResponse.json(
      {
        status: HTTP_STATUS.SERVER_ERROR,
        message: "Error clearing tokens",
        error: error.message
      },
      { status: HTTP_STATUS.SERVER_ERROR }
    );
  }
}