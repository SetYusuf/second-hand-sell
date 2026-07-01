import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Warn if using default secret in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-secret-key-change-this') {
  console.warn('⚠️ WARNING: Using default JWT_SECRET in production! Change JWT_SECRET in .env')
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name: string
  iat?: number
  exp?: number
}

/**
 * Sign JWT token
 * @param payload - User data to encode
 * @returns JWT token string
 */
export function signToken(payload: JWTPayload): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256',
    })
    return token
  } catch (error) {
    console.error('❌ JWT signing error:', error)
    throw new Error('Token signing failed')
  }
}

/**
 * Verify JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

/**
 * Extract Bearer token from Authorization header
 * @param req - Next.js Request object
 * @returns Token string or null
 */
export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('Authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    return token
  }
  
  return null
}

/**
 * Generate a random password reset token
 * @returns Token string
 */
export function generateResetToken(): string {
  // Generate a random string for reset token
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

/**
 * Get token expiration time (1 hour from now)
 * @returns Date object
 */
export function getResetTokenExpiration(): Date {
  const expirationTime = new Date()
  expirationTime.setHours(expirationTime.getHours() + 1)
  return expirationTime
}

export default {
  signToken,
  verifyToken,
  getTokenFromRequest,
  generateResetToken,
  getResetTokenExpiration,
}
