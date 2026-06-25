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

    // Only owner or admin can see owner stats
    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Owner only' },
        { status: 403 }
      )
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    // Get current user's stats
    const userId = user.userId

    const myPosts = await db.collection('posts')
      .countDocuments({ userId })

    const myPostsByType = await db.collection('posts')
      .aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
      .toArray()

    const typeMap: any = {}
    myPostsByType.forEach((item: any) => {
      typeMap[item._id] = item.count
    })

    // Calculate my average price
    const myAvgPriceResult = await db.collection('posts')
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ])
      .toArray()

    const myAvgPrice = myAvgPriceResult[0]?.avgPrice || 0

    // Get my recent posts
    const myRecentPosts = await db.collection('posts')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({
      success: true,
      stats: {
        myPosts,
        myBooks: typeMap['Book'] || 0,
        myPhones: typeMap['Phone'] || 0,
        myComputers: typeMap['Computer'] || 0,
        myElectronics: typeMap['Electronics'] || 0,
        myServices: typeMap['Service'] || 0,
        myAvgPrice: Math.round(myAvgPrice * 100) / 100,
        recentPosts: myRecentPosts.map((p: any) => ({
          _id: p._id.toString(),
          title: p.title,
          type: p.type,
          price: p.price,
          condition: p.condition,
          createdAt: p.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Owner stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}