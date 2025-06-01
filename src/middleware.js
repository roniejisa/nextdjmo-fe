import { NextResponse } from 'next/server'
import { httpClient } from './utils/http'

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================
const CONFIG = {
    AUTH_BASE_URL: process.env.NEXT_PUBLIC_ENDPOINT_URL + 'auth',
    API_KEY: process.env.API_KEY || '123456',
    LOGIN_URL: '/dang-nhap',
    LOGOUT_PATHS: ['/logout', '/dang-xuat', '/auth/logout'],
    DEFAULT_LANG: 'vi',
    SUPPORTED_LANGUAGES: ['en', 'vi'],
    CACHE_TTL: parseInt(process.env.NEXT_PUBLIC_MINUTE_TOKEN_EXPIRES || '30') * 60 * 1000, // Convert to milliseconds
    SESSION_ID_LENGTH: 16,
    MAX_CACHE_SIZE: 1000,
    RATE_LIMIT: {
        MAX_REQUESTS: 100,
        WINDOW_MS: 15 * 60 * 1000 // 15 minutes
    }
}

const PROTECTED_ROUTES = ["/system"]
const SKIP_MIDDLEWARE_PATHS = ['/api/', '.ico', '.svg', '.png', '.jpg', '.css', '.js', '_next/']

// =============================================================================
// SECURITY & CACHING
// =============================================================================
class SecureCache {
    constructor(maxSize = CONFIG.MAX_CACHE_SIZE) {
        this.cache = new Map()
        this.maxSize = maxSize
        this.rateLimitMap = new Map()
    }

    // Rate limiting implementation
    checkRateLimit(identifier) {
        const now = Date.now()
        const windowStart = now - CONFIG.RATE_LIMIT.WINDOW_MS
        
        if (!this.rateLimitMap.has(identifier)) {
            this.rateLimitMap.set(identifier, [])
        }
        
        const requests = this.rateLimitMap.get(identifier)
        // Remove old requests outside the window
        const validRequests = requests.filter(time => time > windowStart)
        
        if (validRequests.length >= CONFIG.RATE_LIMIT.MAX_REQUESTS) {
            return false
        }
        
        validRequests.push(now)
        this.rateLimitMap.set(identifier, validRequests)
        return true
    }

    set(key, value, ttl = CONFIG.CACHE_TTL) {
        // Implement LRU eviction if cache is full
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value
            this.cache.delete(firstKey)
        }

        this.cache.set(key, {
            data: value,
            expires: Date.now() + ttl,
            createdAt: Date.now()
        })
    }

    get(key) {
        const item = this.cache.get(key)
        if (!item) return null
        
        if (Date.now() > item.expires) {
            this.cache.delete(key)
            return null
        }
        
        return item.data
    }

    delete(key) {
        this.cache.delete(key)
    }

    clear() {
        this.cache.clear()
        this.rateLimitMap.clear()
    }

    // Clear cache by token
    async clearTokenCache(token) {
        if (!token) return
        
        try {
            const hashedToken = await SecurityUtils.hashToken(token)
            const cacheKey = `profile_${hashedToken}`
            this.delete(cacheKey)
            
            // Clear all profile caches to be safe
            for (const [key] of this.cache.entries()) {
                if (key.startsWith('profile_')) {
                    this.delete(key)
                }
            }
        } catch (error) {
            console.error('Error clearing token cache:', error)
            // Fallback: clear all auth caches
            this.clearAllAuthCache()
        }
    }

    // Clear all auth cache
    clearAllAuthCache() {
        for (const [key] of this.cache.entries()) {
            if (key.startsWith('profile_')) {
                this.delete(key)
            }
        }
    }

    // Clean expired entries periodically
    cleanup() {
        const now = Date.now()
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expires) {
                this.cache.delete(key)
            }
        }
        
        // Clean rate limit map
        const windowStart = now - CONFIG.RATE_LIMIT.WINDOW_MS
        for (const [key, requests] of this.rateLimitMap.entries()) {
            const validRequests = requests.filter(time => time > windowStart)
            if (validRequests.length === 0) {
                this.rateLimitMap.delete(key)
            } else {
                this.rateLimitMap.set(key, validRequests)
            }
        }
    }
}

const secureCache = new SecureCache()

// Cleanup cache every 10 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        secureCache.cleanup()
    }, 10 * 60 * 1000)
}

// =============================================================================
// SECURITY UTILITIES
// =============================================================================
class SecurityUtils {
    static generateSecureId(length = CONFIG.SESSION_ID_LENGTH) {
        try {
            // Use Web Crypto API
            const array = new Uint8Array(length)
            crypto.getRandomValues(array)
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
        } catch (error) {
            // Fallback to Math.random if crypto is not available
            return Math.random().toString(36).substring(2, 2 + length)
        }
    }

    static async hashToken(token) {
        try {
            // Use Web Crypto API for hashing
            const encoder = new TextEncoder()
            const data = encoder.encode(token)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        } catch (error) {
            // Fallback to simple hash if crypto is not available
            let hash = 0
            for (let i = 0; i < token.length; i++) {
                const char = token.charCodeAt(i)
                hash = ((hash << 5) - hash) + char
                hash = hash & hash // Convert to 32bit integer
            }
            return Math.abs(hash).toString(16)
        }
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input
        return input.replace(/[<>'"]/g, '').trim()
    }

    static isValidPath(pathname) {
        // Basic path traversal protection
        return !pathname.includes('../') && !pathname.includes('..\\')
    }

    static async getClientIdentifier(request) {
        try {
            // Create identifier for rate limiting (use IP + User-Agent hash)
            const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
            const userAgent = request.headers.get('user-agent') || 'unknown'
            const combined = ip + userAgent
            
            // Use Web Crypto API for hashing
            const encoder = new TextEncoder()
            const data = encoder.encode(combined)
            const hashBuffer = await crypto.subtle.digest('SHA-1', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
        } catch (error) {
            // Fallback hash
            return 'fallback_' + Math.random().toString(36).substring(2, 10)
        }
    }

    static createSecureCookieOptions(httpOnly = true) {
        return {
            httpOnly,
            secure: process.env.NODE_ENV === 'production',
            path: "/",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        }
    }
}

// =============================================================================
// HTTP CLIENT WRAPPER
// =============================================================================
class AuthHttpClient {
    static async request(endpoint, method = 'GET', body = null, headers = {}, isRefresh = true) {
        try {
            const startTime = Date.now()
            const response = await httpClient(`${CONFIG.AUTH_BASE_URL}/${endpoint}`, {
                'Content-Type': 'application/json',
                'X-API-KEY': CONFIG.API_KEY,
                'X-Request-ID': SecurityUtils.generateSecureId(8),
                ...headers,
            }, body || {}, method, true, isRefresh)

            // Log slow requests
            const duration = Date.now() - startTime
            if (duration > 5000) {
                console.warn(`Slow auth request: ${endpoint} took ${duration}ms`)
            }

            return response
        } catch (error) {
            console.error(`Auth request failed [${endpoint}]:`, {
                error: error.message,
                endpoint,
                method,
                timestamp: new Date().toISOString()
            })
            return { status: 500, error: 'Internal server error' }
        }
    }
}

// =============================================================================
// AUTHENTICATION SERVICE
// =============================================================================
class AuthenticationService {
    static async validateToken(token) {
        if (!token) return null

        try {
            const hashedToken = await SecurityUtils.hashToken(token)
            const cacheKey = `profile_${hashedToken}`
            let cachedProfile = secureCache.get(cacheKey)
            
            if (cachedProfile) {
                return cachedProfile
            }

            const profile = await AuthHttpClient.request('profile', 'GET', null, {
                'Authorization': `Bearer ${token}`
            })

            if (profile && profile.status === 200 && profile.data) {
                secureCache.set(cacheKey, profile)
                return profile
            }
        } catch (error) {
            console.error('Token validation error:', error)
        }

        return null
    }

    static async refreshAccessToken(refreshToken) {
        if (!refreshToken) return null

        try {
            const refreshData = await AuthHttpClient.request('refresh-token', 'POST', { 
                refreshToken: SecurityUtils.sanitizeInput(refreshToken) 
            }, {}, true)

            if (refreshData && refreshData.status === 200 && refreshData.data) {
                return refreshData.data
            }
        } catch (error) {
            console.error('Token refresh failed:', error)
        }

        return null
    }

    static async logout(token) {
        try {
            if (token) {
                // Clear cache before logout
                await secureCache.clearTokenCache(token)
            }
            
            // Clear all auth cache to ensure clean state
            secureCache.clearAllAuthCache()
            
            console.log('Auth cache cleared for logout')
        } catch (error) {
            console.error('Logout cache clear error:', error)
            // Still clear all auth cache as fallback
            secureCache.clearAllAuthCache()
        }
    }

    static async authenticate(request, providedToken = null, providedRefreshToken = null, isRefresh = false, isOauth = false) {
        const method = request.method
        const pathname = request.nextUrl.pathname
        const isSocial = isOauth && providedToken

        // Get tokens from cookies or parameters
        const token = providedToken || request.cookies.get('token')?.value
        const refreshToken = providedRefreshToken || request.cookies.get('refreshToken')?.value

        // Validate current token
        if (token) {
            const profile = await this.validateToken(token)
            
            if (profile && profile.data) {
                return {
                    isAuthenticated: true,
                    user: profile.data,
                    accessToken: token,
                    refreshToken,
                    isSocial
                }
            }
        }

        // Attempt token refresh for GET requests
        if (refreshToken && !isRefresh && method === "GET") {
            const newTokens = await this.refreshAccessToken(refreshToken)
            
            if (newTokens && newTokens.accessToken) {
                return await this.authenticate(
                    request, 
                    newTokens.accessToken, 
                    newTokens.refreshToken, 
                    true, 
                    isOauth
                )
            }
        }

        return { isAuthenticated: false, isSocial }
    }
}

// =============================================================================
// RESPONSE BUILDER
// =============================================================================
class ResponseBuilder {
    static deleteTokens(response) {
        response.cookies.delete('token')
        response.cookies.delete('refreshToken')
        response.cookies.delete('logged')
        response.cookies.delete('ssId')
        
        // Force browser not to cache response
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
        response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"')
        
        return response
    }

    static createResponse(user, accessToken, refreshToken, request, isAuthenticated, isSocial, newCustomer) {
        const headers = new Headers()
        
        // Add security headers
        headers.set('X-Content-Type-Options', 'nosniff')
        headers.set('X-Frame-Options', 'DENY')
        headers.set('X-XSS-Protection', '1; mode=block')
        headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
        headers.set('Cache-Control', 'no-store, must-revalidate')
        
        if (user) {
            headers.set('user', encodeURIComponent(JSON.stringify(user)))
        }

        let response

        if (isSocial) {
            if (!isAuthenticated) {
                response = NextResponse.redirect(new URL(CONFIG.LOGIN_URL, request.url))
                response.cookies.set('msg', "Đăng nhập không thành công!", { 
                    httpOnly: false, 
                    sameSite: 'Strict',
                    secure: process.env.NODE_ENV === 'production'
                })
            } else {
                const redirectUrl = newCustomer ? '/account/profile' : '/'
                response = NextResponse.redirect(new URL(redirectUrl, request.url))
            }
        } else {
            response = NextResponse.next({
                request: { headers }
            })
        }

        // Set secure cookies
        if (accessToken && isAuthenticated) {
            response.cookies.set('token', accessToken, SecurityUtils.createSecureCookieOptions())
        }

        if (refreshToken && isAuthenticated) {
            response.cookies.set('refreshToken', refreshToken, SecurityUtils.createSecureCookieOptions())
        }

        if (isAuthenticated) {
            response.cookies.set('logged', "OK", SecurityUtils.createSecureCookieOptions(false))
        }

        // Session ID for tracking
        const existingSessionId = request.cookies.get('ssId')?.value
        const sessionId = existingSessionId || SecurityUtils.generateSecureId()
        response.cookies.set('ssId', sessionId, SecurityUtils.createSecureCookieOptions())

        // Set all security headers
        for (const [key, value] of headers.entries()) {
            response.headers.set(key, value)
        }

        return response
    }

    static createLogoutResponse(request) {
        const response = NextResponse.redirect(new URL(CONFIG.LOGIN_URL, request.url))
        
        // Delete all auth cookies
        this.deleteTokens(response)
        
        // Add logout message
        response.cookies.set('msg', "Đã đăng xuất thành công!", { 
            httpOnly: false, 
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 5 // 5 seconds
        })

        return response
    }
}

// =============================================================================
// LANGUAGE & UTILITY FUNCTIONS
// =============================================================================
class LanguageService {
    static getLanguage(request) {
        const pathname = request.nextUrl.pathname
        const pathLang = pathname.split("/")[1]
        return CONFIG.SUPPORTED_LANGUAGES.includes(pathLang) ? pathLang : CONFIG.DEFAULT_LANG
    }
}

class SocialAuthHandler {
    static extractParams(url) {
        const socialToken = url.searchParams.get('token') ? SecurityUtils.sanitizeInput(url.searchParams.get('token')) : null
        const socialRefreshToken = url.searchParams.get('refreshToken') ? SecurityUtils.sanitizeInput(url.searchParams.get('refreshToken')) : null
        const newCustomer = url.searchParams.get('created')

        return {
            socialToken,
            socialRefreshToken,
            newCustomer,
            isOauth: !!newCustomer
        }
    }
}

class LogoutHandler {
    static isLogoutRequest(request) {
        const pathname = request.nextUrl.pathname
        const url = request.nextUrl
        
        // Check if it's a logout path
        const isLogoutPath = CONFIG.LOGOUT_PATHS.some(path => 
            pathname === path || pathname.endsWith(path)
        )
        
        // Check if logout parameter exists
        const hasLogoutParam = url.searchParams.has('logout') || url.searchParams.has('signout')
        
        return isLogoutPath || hasLogoutParam
    }

    static async handleLogoutRequest(request) {
        const token = request.cookies.get('token')?.value
        
        if (token) {
            // Clear auth cache
            await AuthenticationService.logout(token)
        }
        
        // Create logout response
        return ResponseBuilder.createLogoutResponse(request)
    }
}

// =============================================================================
// MAIN MIDDLEWARE FUNCTION
// =============================================================================
export async function middleware(request) {
    const startTime = Date.now()
    
    try {
        const url = request.nextUrl
        const pathname = url.pathname
        const method = request.method

        // Basic security checks
        if (!SecurityUtils.isValidPath(pathname)) {
            return new NextResponse('Bad Request', { status: 400 })
        }

        // Handle logout requests first (before other checks)
        if (LogoutHandler.isLogoutRequest(request)) {
            return await LogoutHandler.handleLogoutRequest(request)
        }

        // Skip middleware for certain paths and methods
        if (method !== 'GET' || SKIP_MIDDLEWARE_PATHS.some(path => pathname.includes(path))) {
            const response = NextResponse.next()
            response.headers.set('Cache-Control', 'no-store, must-revalidate')
            return response
        }

        // Handle social authentication
        let socialAuth = {}
        if (pathname === "/") {
            socialAuth = SocialAuthHandler.extractParams(url)
        }

        const { socialToken, socialRefreshToken, isOauth, newCustomer } = socialAuth

        // Authenticate user
        const authResult = await AuthenticationService.authenticate(
            request, 
            socialToken, 
            socialRefreshToken, 
            false, 
            isOauth
        )

        const { isAuthenticated, accessToken, refreshToken, user, isSocial } = authResult

        // Handle login page
        if (pathname === CONFIG.LOGIN_URL) {
            if (isAuthenticated) {
                const response = NextResponse.redirect(new URL('/', request.url))
                response.headers.set('Cache-Control', 'no-store, must-revalidate')
                return response
            }

            const response = NextResponse.next()
            
            // Handle referral tracking
            const existingRef = request.cookies.get('ref')?.value
            const urlRef = url.searchParams.get('ref')
            const ref = existingRef || (urlRef ? SecurityUtils.sanitizeInput(urlRef) : null)

            if (ref) {
                response.cookies.set('ref', ref, {
                    ...SecurityUtils.createSecureCookieOptions(),
                    maxAge: 60 * 60 * 24 * 30 // 30 days
                })
            }

            response.headers.set('Cache-Control', 'no-store, must-revalidate')
            ResponseBuilder.deleteTokens(response)
            return response
        }

        // Check protected routes
        const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
        
        if (requiresAuth && !isAuthenticated) {
            const response = NextResponse.redirect(new URL(CONFIG.LOGIN_URL, request.url))
            response.headers.set('Cache-Control', 'no-store, must-revalidate')
            return response
        }

        // Set language and create final response
        const language = LanguageService.getLanguage(request)
        const response = ResponseBuilder.createResponse(
            user, 
            accessToken, 
            refreshToken, 
            request, 
            isAuthenticated, 
            isSocial, 
            newCustomer
        )

        response.cookies.set("lang", language, SecurityUtils.createSecureCookieOptions())

        // Performance monitoring
        const duration = Date.now() - startTime
        if (duration > 1000) {
            console.warn(`Slow middleware execution: ${duration}ms for ${pathname}`)
        }

        return response

    } catch (error) {
        console.error('Middleware error:', {
            error: error.message,
            stack: error.stack,
            pathname: request.nextUrl.pathname,
            method: request.method,
            timestamp: new Date().toISOString()
        })
        
        // Return a safe response in case of error
        const response = NextResponse.next()
        response.headers.set('Cache-Control', 'no-store, must-revalidate')
        return response
    }
}

// =============================================================================
// CONFIGURATION
// =============================================================================
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|web-app-manifest-192x192.png|sw.js).*)",
    ],
}