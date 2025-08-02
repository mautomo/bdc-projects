import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible'

// Rate limiters for different endpoints
const rateLimiters = {
  // Login attempts: 5 attempts per 15 minutes
  login: new RateLimiterMemory({
    points: 5,
    duration: 900, // 15 minutes
    blockDuration: 900, // 15 minutes
  }),

  // Password reset: 3 attempts per hour
  passwordReset: new RateLimiterMemory({
    points: 3,
    duration: 3600, // 1 hour
    blockDuration: 3600, // 1 hour
  }),

  // General API: 100 requests per minute
  api: new RateLimiterMemory({
    points: 100,
    duration: 60, // 1 minute
    blockDuration: 60, // 1 minute
  }),

  // User invitation: 10 invitations per hour per user
  invitation: new RateLimiterMemory({
    points: 10,
    duration: 3600, // 1 hour
    blockDuration: 300, // 5 minutes
  }),
}

export async function checkRateLimit(
  type: keyof typeof rateLimiters,
  identifier: string
): Promise<{ success: boolean; remainingPoints?: number; msBeforeNext?: number }> {
  const rateLimiter = rateLimiters[type]
  
  try {
    const result = await rateLimiter.consume(identifier)
    return {
      success: true,
      remainingPoints: result.remainingPoints,
      msBeforeNext: result.msBeforeNext,
    }
  } catch (rejRes: any) {
    return {
      success: false,
      remainingPoints: rejRes.remainingPoints || 0,
      msBeforeNext: rejRes.msBeforeNext || 0,
    }
  }
}

export async function getRateLimitStatus(
  type: keyof typeof rateLimiters,
  identifier: string
): Promise<{ remainingPoints: number; msBeforeNext: number; totalHits: number }> {
  const rateLimiter = rateLimiters[type]
  const result = await rateLimiter.get(identifier)
  
  return {
    remainingPoints: result?.remainingPoints || rateLimiter.points,
    msBeforeNext: result?.msBeforeNext || 0,
    totalHits: (rateLimiter.points - (result?.remainingPoints || rateLimiter.points)),
  }
}

// Helper function to get client identifier (IP + User ID if available)
export function getClientIdentifier(request: Request, userId?: string): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return userId ? `${ip}:${userId}` : ip
}

// Middleware helper for Next.js API routes
export function withRateLimit(
  type: keyof typeof rateLimiters,
  getIdentifier?: (request: Request) => string
) {
  return async function rateLimitMiddleware(
    request: Request,
    handler: () => Promise<Response>
  ): Promise<Response> {
    const identifier = getIdentifier ? getIdentifier(request) : getClientIdentifier(request)
    
    const { success, remainingPoints, msBeforeNext } = await checkRateLimit(type, identifier)
    
    if (!success) {
      const retryAfter = Math.round((msBeforeNext || 0) / 1000)
      return new Response(
        JSON.stringify({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimiters[type].points.toString(),
            'X-RateLimit-Remaining': remainingPoints?.toString() || '0',
            'X-RateLimit-Reset': new Date(Date.now() + (msBeforeNext || 0)).toISOString(),
          },
        }
      )
    }

    const response = await handler()
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', rateLimiters[type].points.toString())
    response.headers.set('X-RateLimit-Remaining', remainingPoints?.toString() || '0')
    
    return response
  }
}