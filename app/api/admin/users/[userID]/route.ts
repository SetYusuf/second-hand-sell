import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/admin/users/:userID — Full admin-only user profile
// Returns identity (incl. email), account meta, and activity data
// (product listings, reports filed against the user, warnings count).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
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

    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })
    }

    const { userID } = await params

    if (!userID || !mongoose.isValidObjectId(userID)) {
      return NextResponse.json({ success: false, error: 'Invalid user ID' }, { status: 400 })
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    const userDoc = await db.collection('users').findOne(
      { _id: new mongoose.Types.ObjectId(userID) },
      {
        projection: {
          password: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
        },
      }
    )

    if (!userDoc) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Derive a username from the name (lowercase, no spaces) — same logic as public endpoint
    const username = (userDoc.name || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

    // Activity data: products listed by this user
    const products = await db.collection('products')
      .find({ userId: userID })
      .sort({ createdAt: -1 })
      .toArray()

    const listings = products.map((p) => ({
      _id: p._id.toString(),
      title: p.title || 'Untitled',
      price: typeof p.price === 'number' ? p.price : 0,
      imageUrl: p.imageUrl || '',
      status: p.status || 'active',
    }))

    // Reports filed against this user
    let reportsCount = 0
    try {
      reportsCount = await db.collection('reports').countDocuments({ targetUserId: userID })
    } catch {
      reportsCount = 0
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        username,
        email: userDoc.email || '',
        avatar: userDoc.avatar || '',
        role: userDoc.role || 'user',
        status: userDoc.status || 'active',
        createdAt: userDoc.createdAt,
        phone: userDoc.phone || '',
        location: userDoc.location || '',
        bio: userDoc.bio || '',
        warnings: typeof userDoc.warnings === 'number' ? userDoc.warnings : 0,
      },
      stats: {
        totalProducts: listings.length,
        reportsCount,
      },
      listings,
    })
  } catch (error) {
    console.error('GET /api/admin/users/:userID error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
