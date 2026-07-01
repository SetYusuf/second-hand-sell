import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// Cache for 60 seconds
let cache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 60 * 1000 // 60 seconds

// GET /api/admin/dashboard-stats — Returns 6 stat numbers (admin only)
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

    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json({ success: true, ...cache.data })
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    // Run all counts in parallel using aggregation
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      totalUsersResult,
      totalProductsResult,
      activeListingsResult,
      bannedUsersResult,
      reportedItemsResult,
      newRegistrationsResult,
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('products').countDocuments(),
      db.collection('products').countDocuments({
        status: { $nin: ['removed', 'banned'] }
      }),
      db.collection('users').countDocuments({ status: 'banned' }),
      db.collection('reports').countDocuments({
        status: { $ne: 'dismissed' }
      }),
      db.collection('users').countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      }),
    ])

    const data = {
      totalUsers: totalUsersResult,
      totalProducts: totalProductsResult,
      activeListings: activeListingsResult,
      bannedUsers: bannedUsersResult,
      reportedItems: reportedItemsResult,
      newRegistrations7d: newRegistrationsResult,
    }

    // Update cache
    cache = { data, timestamp: Date.now() }

    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error('GET /api/admin/dashboard-stats error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
