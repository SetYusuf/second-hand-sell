import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET /api/reports — List reports (admin only)
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

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''

    const query: Record<string, unknown> = {}
    if (status && status !== 'all') {
      query.status = status
    } else {
      query.status = { $ne: 'dismissed' }
    }

    const reports = await db.collection('reports')
      .find(query)
      .sort({ timestamp: -1, createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      reports: reports.map((r) => ({
        _id: r._id.toString(),
        type: r.type || 'product',
        reason: r.reason || '',
        reporter: r.reporter || '',
        targetId: r.targetId || '',
        targetUserId: r.targetUserId || '',
        timestamp: r.timestamp || r.createdAt,
        status: r.status || 'pending',
      })),
    })
  } catch (error) {
    console.error('GET /api/reports error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
