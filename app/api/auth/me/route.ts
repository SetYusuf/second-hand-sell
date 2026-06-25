import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Login required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }
    const users = db.collection('users')

    const dbUser = await users.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { password: 0 } }
    )

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        avatar: dbUser.avatar || '',
        createdAt: dbUser.createdAt
      }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Login required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }
    const users = db.collection('users')

    // Only allow updating name and avatar
    const updateFields: { name?: string; avatar?: string } = {}
    if (body.name) updateFields.name = body.name
    if (body.avatar !== undefined) updateFields.avatar = body.avatar

    await users.updateOne(
      { _id: new ObjectId(user.userId) },
      { $set: updateFields }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
