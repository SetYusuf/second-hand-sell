import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/admin/dashboard-charts — Returns chart data (admin only)
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    // Date range: last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // 1. User Growth — cumulative user count by day (last 30 days)
    const userGrowthRaw = await db.collection('users').aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // Get total users before the 30-day window for cumulative count
    const usersBeforeWindow = await db.collection('users').countDocuments({
      createdAt: { $lt: thirtyDaysAgo }
    })

    let cumulative = usersBeforeWindow
    const userGrowth = userGrowthRaw.map((item) => {
      cumulative += item.newUsers
      return { date: item._id, count: cumulative }
    })

    // 2. Product Posting Trend — products posted per day (last 30 days)
    const productTrendRaw = await db.collection('products').aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    const productTrend = productTrendRaw.map((item) => ({
      date: item._id,
      count: item.count
    }))

    // 3. Category Distribution — count products by type
    const categoryDistRaw = await db.collection('products').aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    const categoryDistribution = categoryDistRaw.map((item) => ({
      category: item._id || 'Unknown',
      count: item.count
    }))

    // 4. Top Sellers — top 5 users by product count
    const topSellersRaw = await db.collection('products').aggregate([
      { $group: { _id: '$userId', productCount: { $sum: 1 } } },
      { $sort: { productCount: -1 } },
      { $limit: 5 }
    ]).toArray()

    // Look up user names
    const sellerIds = topSellersRaw.map((s) => {
      try { return new mongoose.Types.ObjectId(s._id) } catch { return null }
    }).filter((id): id is mongoose.Types.ObjectId => id !== null)

    const sellers = await db.collection('users')
      .find({ _id: { $in: sellerIds } })
      .project({ name: 1 })
      .toArray()

    const sellerMap: Record<string, string> = {}
    sellers.forEach((s) => {
      sellerMap[s._id.toString()] = s.name
    })

    const topSellers = topSellersRaw.map((s) => ({
      userId: s._id,
      name: sellerMap[s._id] || 'Deleted Account',
      productCount: s.productCount
    }))

    return NextResponse.json({
      success: true,
      userGrowth,
      productTrend,
      categoryDistribution,
      topSellers,
    })
  } catch (error) {
    console.error('GET /api/admin/dashboard-charts error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
