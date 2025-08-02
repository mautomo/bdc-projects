import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { securityHeaders, detectSuspiciousActivity, getClientIP } from '@/lib/security'
import { createAuditLog } from '@/lib/audit'

export default withAuth(
  function middleware(req) {
    // Add security headers
    const response = NextResponse.next()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Security monitoring
    const clientIP = getClientIP(req)
    const suspiciousActivity = detectSuspiciousActivity({
      ip: clientIP,
      userAgent: req.headers.get('user-agent') || undefined,
      path: req.nextUrl.pathname,
      method: req.method,
    })

    // Log suspicious activity
    if (suspiciousActivity.isSuspicious) {
      createAuditLog({
        action: 'SUSPICIOUS_ACTIVITY',
        resource: 'SECURITY',
        details: {
          ip: clientIP,
          userAgent: req.headers.get('user-agent'),
          path: req.nextUrl.pathname,
          method: req.method,
          reasons: suspiciousActivity.reasons,
        },
      }).catch(console.error)

      // Block obviously malicious requests
      if (suspiciousActivity.reasons.some(reason => 
        reason.includes('SQL injection') || 
        reason.includes('XSS attempt')
      )) {
        return new Response('Forbidden', { status: 403 })
      }
    }

    // Allow access to auth pages and API routes
    if (
      req.nextUrl.pathname.startsWith('/auth') ||
      req.nextUrl.pathname.startsWith('/api/auth')
    ) {
      return response
    }

    // Redirect to sign-in if not authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Check if user email is from allowed domains
    const email = req.nextauth.token.email?.toLowerCase()
    const allowedDomains = ['vandoko.ai', 'strolid.com']
    const userDomain = email?.split('@')[1]
    
    if (req.nextauth.token.authType === 'GOOGLE_SSO' && 
        (!userDomain || !allowedDomains.includes(userDomain))) {
      return NextResponse.redirect(new URL('/auth/error', req.url))
    }

    // Check if user is active
    if (req.nextauth.token.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/auth/error', req.url))
    }

    // Admin route protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const userRole = req.nextauth.token.role
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (
          req.nextUrl.pathname.startsWith('/auth') ||
          req.nextUrl.pathname.startsWith('/api/auth')
        ) {
          return true
        }
        
        // Require token for all other pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}