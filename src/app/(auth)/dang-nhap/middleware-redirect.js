import { NextResponse } from 'next/server'

// Sử dụng biến môi trường cho URL và API Key để dễ dàng cấu hình và bảo mật
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + 'auth' || 'http://localhost:8000/auth'
const API_KEY = process.env.API_KEY || '123456'
const URL_LOGIN = '/dang-nhap'
const cache = new Map()
// Hàm chung để thực hiện các yêu cầu HTTP
async function fetchForAuth(endpoint, method = 'GET', body = null, headers = {}) {
    // try {
    const response = await fetch(`${AUTH_BASE_URL}/${endpoint}`, {
        method,
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
            ...headers,
        },
        cache: 'no-cache',
        body: body ? JSON.stringify(body) : null,
    })
    const data = await response.json()
    return data
    // } catch (error) {
    //     console.error(`Error fetching ${endpoint}:`, error)
    //     return { status: 500 }
    // }
}
// Hàm xóa token
function deleteTokens(response) {
    response.cookies.delete('token')
    response.cookies.delete('refreshToken')
    return response
}

// Hàm kiểm tra và làm mới token nếu cần
async function authenticate(request, token = null, refreshToken = null, isRefresh = false) {
    const pathname = request.nextUrl.pathname
    const isSocial = token ? true : false
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
            cache.set('DATA_USER_' + token, { profile, expired: now.getTime() + 1000 * 60 * process.env.NEXT_PUBLIC_MINUTE_TOKEN_EXPIRES })
        }

        if (profile.status == 200) {
            return { isAuthenticated: true, user: profile.data, accessToken: token, refreshToken, isSocial }
        }
    }

    // Nếu token không hợp lệ, thử làm mới
    if (refreshToken && !isRefresh) {
        const refreshData = await fetchForAuth('refresh-token', 'POST', { refreshToken })
        if (refreshData.status === 200 && refreshData.data) {
            const { accessToken, refreshToken: newRefreshToken } = refreshData.data
            return authenticate(request, accessToken, newRefreshToken, true)
        }
    }

    return { isAuthenticated: false, isSocial }
}

function setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial) {
    const headers = new Headers()
    if (user) headers.set('user', encodeURIComponent(JSON.stringify(user)))
    let response

    if (isSocial) {
        if (!isAuthenticated) {
            response = NextResponse.redirect(new URL(URL_LOGIN, request.url))
            response.cookies.set('msg', "Đăng nhập không thành công!", { httpOnly: false, sameSite: 'Strict' })
        } else {
            response = NextResponse.redirect(new URL('/', request.url))
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

    // Tạo cookie riêng để làm phần đã xem
    const ssId = request.cookies.get('ssId') != undefined ? request.cookies.get('ssId').value : makeid(12)
    response.cookies.set('ssId', ssId, { httpOnly: true, secure: true, path: "/", sameSite: "strict" })

    return response
}
export async function middleware(request) {
    // Định nghĩa các route cần bảo vệ

    // Lấy URL đày đủ
    const url = request.nextUrl;

    // Lấy params từ URL (nếu có)
    const params = url.searchParams;
    // Riêng chỗ này để kiểm tra token sau khi đăng nhập mạng xã hội
    const socialToken = params.get('token');
    const socialRefreshToken = params.get('refreshToken');
    const newCustomer = params.get('created');

    const requireRoutes = ["/system"]

    const pathname = request.nextUrl.pathname
    const method = request.method;


    const { isAuthenticated, accessToken, refreshToken, user, isSocial } = await authenticate(request, socialToken, socialRefreshToken)
    if (pathname === URL_LOGIN) {
        if (isAuthenticated === true) {
            // Nếu đã đăng nhập, chuyển hướng về trang chủ
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Nếu không xác thực, xóa cookie và tiếp tục
        const response = NextResponse.next()
        deleteTokens(response)
        return response
    }

    // Các trang bắt buộc đăng nhập

    // Luôn phải kiểm tra 2 trường hợp 1 là nếu có cần bảo về
    const isRedirectLogin = (requireRoutes.length === 0 && !isAuthenticated) || (!isAuthenticated && requireRoutes.filter(router => pathname.startsWith(router)).length > 0)
    if (isRedirectLogin) {
        // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
        const response = NextResponse.redirect(new URL(URL_LOGIN, request.url))
        return response
    }
    if (method != 'GET') {
        return NextResponse.next()
    }

    return setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial)
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

export const config = {
    matcher: [
        // Loại trừ các đường dẫn không cần middleware
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
    ],
}