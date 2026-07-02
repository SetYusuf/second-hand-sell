import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { createRateLimiter, getClientIP, rateLimitResponse } from '@/lib/rate-limit'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import mongoose from 'mongoose'

// Rate limiter: max 5 attempts per minute per IP
const registerLimiter = createRateLimiter({ maxRequests: 5, windowMs: 60 * 1000 })

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(req)
    if (!registerLimiter(clientIP)) {
      console.log(`⚠️ Rate limit exceeded for IP: ${clientIP}`)
      return rateLimitResponse()
    }

    console.log('🔄 Processing registration request...')
    
    // Get request body
    const body = await req.json()
    const { name, email, password, confirmPassword, role } = body

    // ============ VALIDATION ============
    if (!name || !name.trim()) {
      console.log('❌ Validation: Name is required')
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    if (name.trim().length < 3) {
      console.log('❌ Validation: Name must be at least 3 characters')
      return NextResponse.json(
        { success: false, error: 'Name must be at least 3 characters' },
        { status: 400 }
      )
    }

    if (!email || !email.trim()) {
      console.log('❌ Validation: Email is required')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Validation: Invalid email format')
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      console.log('❌ Validation: Password must be at least 6 characters')
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      console.log('❌ Validation: Passwords do not match')
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['user', 'owner', 'admin']
    const userRole = role && validRoles.includes(role) ? role : 'user'

    // ============ DATABASE CONNECTION ============
    console.log('📡 Connecting to MongoDB...')
    const db = await getDB()
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }
    const users = db.collection('users')

    // ============ CHECK EXISTING USER ============
    console.log(`🔍 Checking if user with email ${email} exists...`)
    const existingUser = await users.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      console.log('❌ User already exists with this email')
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 409 } // Conflict
      )
    }

    // ============ HASH PASSWORD ============
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 10)

    // ============ CREATE NEW USER ============
    console.log(`✅ Creating new user: ${name} (${email})`)
    const result = await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: userRole,
      avatar: null,
      phone: null,
      location: null,
      bio: null,
      isEmailVerified: false,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const userId = result.insertedId.toString()
    console.log(`✅ User created successfully with ID: ${userId}`)

    // ============ GENERATE JWT TOKEN ============
    const token = signToken({
      userId: userId,
      email: email.toLowerCase().trim(),
      role: userRole,
      name: name.trim(),
    })

    // ============ RETURN SUCCESS ============
    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          id: userId,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          role: userRole,
        },
        token,
      },
      { status: 201 }
    )

    // Set JWT as httpOnly cookie
    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    console.log('✅ Registration successful')
    return response
  } catch (error) {
    console.error('❌ Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: `Registration failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}
