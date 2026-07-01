import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/users/:userID — Returns public user info
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    const { userID } = await params

    if (!userID || !mongoose.isValidObjectId(userID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const users = db.collection('users')

    const user = await users.findOne(
      { _id: new mongoose.Types.ObjectId(userID) },
      {
        projection: {
          password: 0,
          email: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
          isEmailVerified: 0,
        },
      }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Derive a username from the name (lowercase, no spaces)
    const username = (user.name || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        username,
        avatar: user.avatar || '',
        location: user.location || '',
        bio: user.bio || '',
        phone: user.phone || '',
        role: user.role || 'user',
        memberSince: user.createdAt,
      },
    })
  } catch (error) {
    console.error('GET /api/users/:userID error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/:userID — Update user (admin only)
// Body: { status?: 'active' | 'banned', role?: 'user' | 'owner' | 'admin' }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Login required' },
        { status: 401 }
      )
    }

    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    if (authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      )
    }

    const { userID } = await params

    if (!userID || !mongoose.isValidObjectId(userID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const update: Record<string, string> = {}
    const incUpdate: Record<string, number> = {}

    if (body.status && ['active', 'banned'].includes(body.status)) {
      update.status = body.status
    }
    if (body.role && ['user', 'owner', 'admin'].includes(body.role)) {
      update.role = body.role
    }
    if (body.warn === true) {
      incUpdate.warnings = 1
    }

    if (Object.keys(update).length === 0 && Object.keys(incUpdate).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const updateDoc: Record<string, unknown> = {}
    if (Object.keys(update).length > 0) {
      updateDoc.$set = update
    }
    if (Object.keys(incUpdate).length > 0) {
      updateDoc.$inc = incUpdate
    }

    const result = await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userID) },
      updateDoc
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('PATCH /api/users/:userID error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/:userID — Delete user (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Login required' },
        { status: 401 }
      )
    }

    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    if (authUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      )
    }

    const { userID } = await params

    if (!userID || !mongoose.isValidObjectId(userID)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Prevent admin from deleting themselves
    if (authUser.userId === userID) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const result = await db.collection('users').deleteOne({
      _id: new mongoose.Types.ObjectId(userID),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Also delete the user's posts
    await db.collection('posts').deleteMany({ userId: userID })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/users/:userID error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
