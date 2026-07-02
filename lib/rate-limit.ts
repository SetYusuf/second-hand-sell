import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter for Next.js API routes
// Map: key (e.g., IP) -> array of { timestamp: number }
const rateLimitStore = new Map<string, number[]>()

interface RateLimitOptions {
  maxRequests: number
  windowMs: number // milliseconds
}

export function createRateLimiter(options: RateLimitOptions) {
  return (key: string): boolean => {
    const now = Date.now()
    const windowStart = now - options.windowMs

    // Get or create array for this key
    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, [])
    }

    const timestamps = rateLimitStore.get(key)!

    // Remove old timestamps outside the window
    const recentTimestamps = timestamps.filter((ts) => ts > windowStart)
    rateLimitStore.set(key, recentTimestamps)

    // Check if limit exceeded
    if (recentTimestamps.length >= options.maxRequests) {
      return false // Rate limit exceeded
    }

    // Add current request
    recentTimestamps.push(now)
    return true // Request allowed
  }
}

export function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1'
  return ip
}

export function rateLimitResponse() {
  return NextResponse.json(
    { success: false, error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}