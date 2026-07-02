import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Follow } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// POST /api/follow/:userId — follow a user
export async function POST(
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

    if (userId === authUser.userId) {
      return NextResponse.json({ success: false, error: 'Cannot follow yourself' }, { status: 400 })
    }

    await connectDB()

    const existing = await Follow.findOne({
      followerId: authUser.userId,
      followingId: userId,
    })

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already following', isFollowing: true })
    }

    await Follow.create({
      followerId: authUser.userId,
      followingId: userId,
    })

    // Follow recorded in database. The followed user will see the notification on next UI refresh.
    // No real-time socket emit needed.

    return NextResponse.json({ success: true, isFollowing: true })
  } catch (error) {
    console.error('POST /api/follow/:userId error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/follow/:userId — unfollow a user
export async function DELETE(
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

    await Follow.deleteOne({
      followerId: authUser.userId,
      followingId: userId,
    })

    return NextResponse.json({ success: true, isFollowing: false })
  } catch (error) {
    console.error('DELETE /api/follow/:userId error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
