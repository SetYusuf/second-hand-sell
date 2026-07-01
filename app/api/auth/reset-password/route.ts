import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

/**
 * POST /api/auth/reset-password
 * Reset password using token from forgot-password
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Processing password reset request...')
    
    const body = await req.json()
    const { token, newPassword, confirmPassword } = body

    // ============ VALIDATION ============
    if (!token || !token.trim()) {
      console.log('❌ Validation: Reset token is required')
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!newPassword || newPassword.length < 6) {
      console.log('❌ Validation: Password must be at least 6 characters')
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      console.log('❌ Validation: Passwords do not match')
      return NextResponse.json(
        { success: false, error: 'Passwords do not match' },
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

    // ============ FIND USER BY RESET TOKEN ============
    console.log('🔍 Finding user by reset token...')
    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Token not expired
    })

    if (!user) {
      console.log('❌ Invalid or expired reset token')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // ============ HASH NEW PASSWORD ============
    console.log('🔐 Hashing new password...')
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // ============ UPDATE PASSWORD AND CLEAR RESET TOKEN ============
    console.log('✏️ Updating password...')
    await users.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      }
    )

    console.log('✅ Password updated successfully')

    // ============ RETURN SUCCESS ============
    return NextResponse.json(
      {
        success: true,
        message: 'Password reset successfully. Please login with your new password.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Password reset error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}