import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET /api/users — List users (admin only)
// Supports optional query params: limit, role, status, search
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

    // Only admin can list all users
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '0', 10) || 0
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''

    const query: Record<string, unknown> = {}
    if (role && role !== 'all') {
      query.role = role
    }
    if (status && status !== 'all') {
      query.status = status
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const cursor = db.collection('users').find(
      query,
      {
        projection: {
          password: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
        },
      }
    ).sort({ createdAt: -1 })

    if (limit > 0) {
      cursor.limit(limit)
    }

    const users = (await cursor.toArray()) as unknown as Array<{
      _id: { toString: () => string }
      name: string
      email: string
      role: string
      createdAt: Date
      status?: string
    }>

    // Count listings (posts) per user for the admin dashboard
    const userIds = users.map((u) => u._id.toString())
    const listingsAgg = (await db.collection('posts')
      .aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
      ])
      .toArray()) as unknown as Array<{ _id: string; count: number }>

    const listingsMap: Record<string, number> = {}
    listingsAgg.forEach((item) => {
      listingsMap[item._id] = item.count
    })

    const formattedUsers = users.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || 'user',
      createdAt: u.createdAt,
      status: u.status || 'active',
      listingsCount: listingsMap[u._id.toString()] || 0,
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}