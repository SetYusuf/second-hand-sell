import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// PATCH /api/reports/:id — Update report status (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: 'Invalid report ID' }, { status: 400 })
    }

    const body = await req.json()
    const update: Record<string, string> = {}
    if (body.status && ['dismissed', 'resolved', 'pending'].includes(body.status)) {
      update.status = body.status
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 })
    }

    const db = await getDB()
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 })
    }

    const result = await db.collection('reports').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: update }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Report updated successfully' })
  } catch (error) {
    console.error('PATCH /api/reports/:id error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
