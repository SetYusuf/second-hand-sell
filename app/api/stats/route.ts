import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

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

    // Only admin can see all stats
    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    // Count documents in each collection
    const totalUsers = await db.collection('users').countDocuments()
    const totalOwners = await db.collection('users')
      .countDocuments({ role: 'owner' })
    const totalAdmins = await db.collection('users')
      .countDocuments({ role: 'admin' })

    const totalPosts = await db.collection('posts').countDocuments()

    // Count by type
    const postsByType = await db.collection('posts')
      .aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
      .toArray()

    const typeMap: any = {}
    postsByType.forEach((item: any) => {
      typeMap[item._id] = item.count
    })

    // Calculate average price
    const avgPriceResult = await db.collection('posts')
      .aggregate([
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ])
      .toArray()

    const avgPrice = avgPriceResult[0]?.avgPrice || 0

    // Get recent posts
    const recentPosts = await db.collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalAdmins,
        totalPosts,
        totalBooks: typeMap['Book'] || 0,
        totalPhones: typeMap['Phone'] || 0,
        totalComputers: typeMap['Computer'] || 0,
        totalElectronics: typeMap['Electronics'] || 0,
        totalServices: typeMap['Service'] || 0,
        avgPrice: Math.round(avgPrice * 100) / 100,
        recentPosts: recentPosts.map((p: any) => ({
          _id: p._id.toString(),
          title: p.title,
          type: p.type,
          price: p.price,
          contactName: p.contactName,
          createdAt: p.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}