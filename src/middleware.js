import { NextResponse } from 'next/server'
import { httpClient } from './utils/http'
import { cookies } from 'next/headers'

// Sử dụng biến môi trường cho URL và API Key để dễ dàng cấu hình và bảo mật
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + 'auth'
const API_KEY = process.env.API_KEY || '123456'
const URL_LOGIN = '/dang-nhap'
const cache = new Map()
const defaultLang = 'vi'; // Ngôn ngữ mặc định
const languages = ['en', 'vi']; // Các ngôn ngữ hỗ trợ
// Hàm chung để thực hiện các yêu cầu HTTP
async function fetchForAuth(endpoint, method = 'GET', body = null, headers = {}, isRefresh = true) {
    try {
        const response = await httpClient(`${AUTH_BASE_URL}/${endpoint}`, {
            'Content-Type': 'application/json',
            ...headers,

        }, body ? body : {}, method, true, isRefresh)
        return response
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error)
        return { status: 500 }
    }
}
// Hàm xóa token
function deleteTokens(response) {
    response.cookies.delete('token')
    response.cookies.delete('refreshToken')
    return response
}

// Hàm kiểm tra và làm mới token nếu cần
async function authenticate(request, token = null, refreshToken = null, isRefresh = false, isOauth = false) {
    const method = request.method
    const pathname = request.nextUrl.pathname
    const isSocial = isOauth && token ? true : false
    token = token ? token : request.cookies.get('token')?.value
    refreshToken = refreshToken ? refreshToken : request.cookies.get('refreshToken')?.value
    // Kiểm tra token hiện tại
    if (token) {
        let profile = null
        let now = new Date()
        let expired = null
        if (cache.has('DATA_USER_' + token) && !pathname.startsWith('/system')) {
            let data = cache.get('DATA_USER_' + token)
            profile = data.profile
            expired = data.expired
            if (!expired || now.getTime() > expired) {
                profile = null;
            }
        }

        if (!profile) {
            profile = await fetchForAuth('profile', 'GET', null, {
                'Authorization': `Bearer ${token}`
            })
        }

        if (profile && profile.status == 200) {
            cache.set('DATA_USER_' + token, { profile, expired: now.getTime() + 1000 * 60 * process.env.NEXT_PUBLIC_MINUTE_TOKEN_EXPIRES })
            return { isAuthenticated: true, user: profile.data, accessToken: token, refreshToken, isSocial }
        }
    }
    // Nếu token không hợp lệ, thử làm mới
    if (refreshToken && !isRefresh && method == "GET") {
        const refreshData = await fetchForAuth('refresh-token', 'POST', { refreshToken }, {}, true)

        if (refreshData && refreshData.status === 200 && refreshData.data) {
            const { accessToken, refreshToken: newRefreshToken } = refreshData.data
            return await authenticate(request, accessToken, newRefreshToken, true, isOauth)
        }
    }

    return { isAuthenticated: false, isSocial }
}

function setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial, newCustomer) {
    const headers = new Headers()
    if (user) headers.set('user', encodeURIComponent(JSON.stringify(user)))
    let response

    if (isSocial) {
        if (!isAuthenticated) {
            response = NextResponse.redirect(new URL(URL_LOGIN, request.url))
            response.cookies.set('msg', "Đăng nhập không thành công!", { httpOnly: false, sameSite: 'Strict' })
        } else {
            response = NextResponse.redirect(new URL(newCustomer ? '/account/profile' : '/', request.url))
        }
    } else {
        response = NextResponse.next({
            request: {
                headers: headers
            }
        })
    }
    if (accessToken && isAuthenticated) response.cookies.set('token', accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict"
    })

    if (refreshToken && isAuthenticated) response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict"
    })

    if (isAuthenticated) {
        response.cookies.set('logged', "OK")
    }

    // Tạo cookie riêng để làm phần đã xem
    const ssId = cookies().has('ssId') ? cookies().get('ssId').value : makeid(12)
    response.cookies.set('ssId', ssId, { httpOnly: true, secure: true, path: "/", sameSite: "strict" })
    response.headers.set('Cache-Control', 'no-store, must-revalidate');

    return response
}

function getLanguage(request) {
    const url = request.nextUrl
    const pathname = url.pathname
    const language = languages.find(language => language === pathname.split("/")[1]) ?? defaultLang
    return language
}

export async function middleware(request) {
    // Định nghĩa các route cần bảo vệ
    const url = request.nextUrl
    const requireRoutes = ["/system"]
    const pathname = url.pathname
    const method = request.method;

    // Nếu đường khác thì next cmnl ở đây đi 
    // Skip middleware for specific paths
    if (method != 'GET' || pathname.startsWith('/api/') || pathname.endsWith('.ico') || pathname.endsWith('.svg') || pathname.endsWith(".png") || pathname.endsWith(".jpg")) {
        const response = NextResponse.next()
        return response
    }


    let socialAuth = {};
    if (pathname === "/") {
        socialAuth = extractSocialAuthParams(url);
    }

    const { socialToken, socialRefreshToken, isOauth, newCustomer } = socialAuth;
    const { isAuthenticated, accessToken, refreshToken, user, isSocial } = await authenticate(request, socialToken, socialRefreshToken, false, isOauth)
    if (pathname === URL_LOGIN) {
        if (isAuthenticated === true) {
            // Nếu đã đăng nhập, chuyển hướng về trang chủ
            const response = NextResponse.redirect(new URL('/', request.url))
            response.headers.set('Cache-Control', 'no-store, must-revalidate');
            return response
        }

        // Nếu không xác thực, xóa cookie và tiếp tục
        const response = NextResponse.next()

        // Xử lý để chắc chắn được lưu ref
        const ref = cookies().has('ref') ? cookies().get('ref').value : url.searchParams.get('ref') || null;
        if (ref) {
            response.cookies.set('ref', ref, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30
            })
        }

        response.headers.set('Cache-Control', 'no-store, must-revalidate');
        deleteTokens(response)
        return response
    }

    // Các trang bắt buộc đăng nhập

    // Luôn phải kiểm tra 2 trường hợp 1 là nếu có cần bảo về
    // const isRedirectLogin = (requireRoutes.length === 0 && !isAuthenticated) || (!isAuthenticated && requireRoutes.filter(router => pathname.startsWith(router)).length > 0)
    const isRedirectLogin = !isAuthenticated && !accessToken && !refreshToken;
    if (isRedirectLogin) {
        // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
        const response = NextResponse.redirect(new URL(URL_LOGIN, request.url))
        response.headers.set('Cache-Control', 'no-store, must-revalidate');
        return response
    }




    // Redirect if there is no locale
    const language = getLanguage(request)
    const response = setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial, newCustomer)
    response.cookies.set("lang", language, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict"
    })
    return response
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


function extractSocialAuthParams(url) {
    const socialToken = url.searchParams.get('token') || null;
    const socialRefreshToken = url.searchParams.get('refreshToken') || null;
    const newCustomer = url.searchParams.get('created') || null;

    return {
        socialToken,
        socialRefreshToken,
        newCustomer,
        isOauth: !!newCustomer, // Xác định nếu là đăng nhập mạng xã hội
    };
}

// Xử lý chức năng lưu ref aff tại middleware

export const config = {
    matcher: [
        // Loại trừ các đường dẫn không cần middleware
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
    ],
}

