import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import mongoose from 'mongoose'

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Processing login request...')
    
    const body = await req.json()
    const { email, password } = body

    // ============ VALIDATION ============
    if (!email || !email.trim()) {
      console.log('❌ Validation: Email is required')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password) {
      console.log('❌ Validation: Password is required')
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

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

    // ============ FIND USER ============
    console.log(`🔍 Finding user with email: ${email}`)
    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // ============ VERIFY PASSWORD ============
    console.log('🔐 Verifying password...')
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      console.log('❌ Password verification failed')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // ============ CHECK IF BANNED ============
    if (user.status === 'banned') {
      console.log('❌ User is banned')
      return NextResponse.json(
        { success: false, error: 'Your account has been banned. Please contact an administrator.' },
        { status: 403 }
      )
    }

    console.log('✅ Password verified successfully')

    // ============ GENERATE JWT TOKEN ============
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    })

    // ============ RETURN SUCCESS ============
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || '',
        },
        token,
      },
      { status: 200 }
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

    console.log('✅ Login successful')
    return response
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}