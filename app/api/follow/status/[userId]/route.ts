import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Follow } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET /api/follow/status/:userId — whether logged-in user follows this userId
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }

    const { userId } = await params

    await connectDB()

    const follow = await Follow.findOne({
      followerId: authUser.userId,
      followingId: userId,
    })

    return NextResponse.json({ success: true, isFollowing: !!follow })
  } catch (error) {
    console.error('GET /api/follow/status/:userId error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
