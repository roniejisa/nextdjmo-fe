import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT_URL + 'auth'
const API_KEY = process.env.API_KEY || '123456'
const URL_LOGIN = '/dang-nhap'
const defaultLang = 'vi'
const languages = ['en', 'vi']

function deleteTokens(response) {
    response.cookies.delete('token')
    response.cookies.delete('refreshToken')
    response.cookies.delete('logged')
    return response
}

// Sửa lỗi trong hàm authenticate
async function authenticate(request, token = null, refreshToken = null, isRefresh = false, isOauth = false) {
    const method = request.method
    const isSocial = isOauth && token ? true : false
    
    token = token ? token : request.cookies.get('token')?.value
    refreshToken = refreshToken ? refreshToken : request.cookies.get('refreshToken')?.value

    // Kiểm tra token hiện tại
    if (token) {
        try {
            const response = await fetch(AUTH_BASE_URL + '/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-API-KEY': API_KEY,
                    'Content-Type': 'application/json'
                }
            })
            
            // Kiểm tra status code trước khi parse JSON
            if (response.ok) {
                const profile = await response.json()
                if (profile && profile.status === 200 && profile.data) {
                    return { 
                        isAuthenticated: true, 
                        user: profile.data, 
                        accessToken: token, 
                        refreshToken, 
                        isSocial 
                    }
                }
            } else if (response.status === 401) {
                console.log('Token expired or invalid, status:', response.status)
                // Token hết hạn, không log error mà để logic refresh token xử lý
            } else {
                console.log('Profile fetch failed with status:', response.status)
            }
        } catch (error) {
            console.error('Profile fetch error:', error)
        }
    }

    // Nếu token không hợp lệ hoặc hết hạn, thử làm mới
    if (refreshToken && !isRefresh && method === "GET") {
        try {
            const refreshResponse = await fetch(AUTH_BASE_URL + '/refresh-token', {
                headers: {
                    "X-API-KEY": API_KEY,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ refreshToken })
            })

            // Kiểm tra status code của refresh token
            if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json()
                
                if (refreshData && refreshData.status === 200 && refreshData.data) {
                    const { accessToken, refreshToken: newRefreshToken } = refreshData.data
                    console.log('Token refreshed successfully')
                    
                    // Gọi lại authenticate với token mới để verify
                    return await authenticate(request, accessToken, newRefreshToken, true, isOauth)
                } else {
                    console.log('Refresh token response invalid:', refreshData?.status)
                }
            } else if (refreshResponse.status === 401) {
                console.log('Refresh token expired or invalid')
                // Refresh token cũng hết hạn
            } else {
                console.log('Refresh token failed with status:', refreshResponse.status)
            }
        } catch (error) {
            console.error('Refresh token error:', error)
        }
    }

    return { isAuthenticated: false, isSocial, shouldClearTokens: true }
}

function setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial, newCustomer, shouldClearTokens = false) {
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

    // Xóa tokens nếu cần
    if (shouldClearTokens) {
        deleteTokens(response)
    } else {
        // Set tokens nếu authenticated
        if (accessToken && isAuthenticated) {
            response.cookies.set('token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 // 24 hours
            })
        }

        if (refreshToken && isAuthenticated) {
            response.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30 // 30 days
            })
        }

        if (isAuthenticated) {
            response.cookies.set('logged', "OK", {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                path: "/",
                sameSite: "strict"
            })
        }
    }

    // Tạo cookie riêng để làm phần đã xem
    const cookieStore = cookies()
    const ssId = cookieStore.has('ssId') ? cookieStore.get('ssId').value : makeid(12)
    response.cookies.set('ssId', ssId, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        path: "/", 
        sameSite: "strict" 
    })
    
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    return response
}

function getLanguage(request) {
    const url = request.nextUrl
    const pathname = url.pathname
    const language = languages.find(language => language === pathname.split("/")[1]) ?? defaultLang
    return language
}

export async function middleware(request) {
    const url = request.nextUrl
    const requireRoutes = ["/system"]
    const pathname = url.pathname
    const method = request.method

    // Skip middleware for specific paths
    if (method !== 'GET' || pathname.startsWith('/api/')) {
        const response = NextResponse.next()
        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        return response
    }

    let socialAuth = {}
    if (pathname === "/") {
        socialAuth = extractSocialAuthParams(url)
    }

    const { socialToken, socialRefreshToken, isOauth, newCustomer } = socialAuth
    
    try {
        const authResult = await authenticate(request, socialToken, socialRefreshToken, false, isOauth)
        const { isAuthenticated, accessToken, refreshToken, user, isSocial, shouldClearTokens } = authResult

        // Xử lý trang login
        if (pathname === URL_LOGIN) {
            if (isAuthenticated === true) {
                const response = NextResponse.redirect(new URL('/', request.url))
                response.headers.set('Cache-Control', 'no-store, must-revalidate')
                return response
            }

            const response = NextResponse.next()
            const cookieStore = cookies()
            const ref = cookieStore.has('ref') ? cookieStore.get('ref').value : url.searchParams.get('ref') || null
            if (ref) {
                response.cookies.set('ref', ref, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: "/",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 30
                })
            }

            response.headers.set('Cache-Control', 'no-store, must-revalidate')
            deleteTokens(response)
            return response
        }

        // Kiểm tra các trang bắt buộc đăng nhập
        const isRedirectLogin = (!isAuthenticated && requireRoutes.some(router => pathname.startsWith(router)))
            
        if (isRedirectLogin) {
            const response = NextResponse.redirect(new URL(URL_LOGIN, request.url))
            response.headers.set('Cache-Control', 'no-store, must-revalidate')
            deleteTokens(response)
            return response
        }

        // Set language và response
        const language = getLanguage(request)
        const response = setResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial, newCustomer, shouldClearTokens)
        
        response.cookies.set("lang", language, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: "/",
            sameSite: "strict"
        })
        
        return response
        
    } catch (error) {
        console.error('Middleware authentication error:', error)
        
        const response = NextResponse.next()
        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        deleteTokens(response)
        
        const isProtectedRoute = requireRoutes.some(router => pathname.startsWith(router))
        if (isProtectedRoute) {
            return NextResponse.redirect(new URL(URL_LOGIN, request.url))
        }
        
        return response
    }
}

function makeid(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }
    return result
}

function extractSocialAuthParams(url) {
    const socialToken = url.searchParams.get('token') || null
    const socialRefreshToken = url.searchParams.get('refreshToken') || null
    const newCustomer = url.searchParams.get('created') || null

    return {
        socialToken,
        socialRefreshToken,
        newCustomer,
        isOauth: !!newCustomer,
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
    ],
}