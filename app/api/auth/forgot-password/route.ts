import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { generateResetToken, getResetTokenExpiration } from '@/lib/auth'
import mongoose from 'mongoose'

/**
 * POST /api/auth/forgot-password
 * Generate password reset token and store in database
 */
export async function POST(req: NextRequest) {
  try {
    console.log('🔄 Processing forgot password request...')
    
    const body = await req.json()
    const { email } = body

    // ============ VALIDATION ============
    if (!email || !email.trim()) {
      console.log('❌ Validation: Email is required')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
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
      // Don't reveal if email exists or not (security best practice)
      console.log('⚠️ User not found but returning success for security')
      return NextResponse.json(
        {
          success: true,
          message: 'If an account with that email exists, a reset link has been sent',
        },
        { status: 200 }
      )
    }

    // ============ GENERATE RESET TOKEN ============
    console.log('🔑 Generating reset token...')
    const resetToken = generateResetToken()
    const resetTokenExpiration = getResetTokenExpiration()

    // ============ SAVE RESET TOKEN TO DATABASE ============
    console.log('💾 Saving reset token to database...')
    await users.updateOne(
      { _id: new mongoose.Types.ObjectId(user._id) },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiration,
        },
      }
    )

    console.log('✅ Reset token saved successfully')

    // ============ TODO: SEND EMAIL ============
    // In production, send email with reset link:
    // const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    // await sendEmail(user.email, resetLink);
    
    console.log('⚠️ Email sending not implemented yet')
    console.log(`Reset token: ${resetToken} (expires at ${resetTokenExpiration})`)

    // ============ RETURN SUCCESS ============
    return NextResponse.json(
      {
        success: true,
        message: 'If an account with that email exists, a reset link has been sent',
        // For testing purposes only (remove in production):
        ...(process.env.NODE_ENV === 'development' && {
          testToken: resetToken,
          testTokenExpires: resetTokenExpiration.toISOString(),
        }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
