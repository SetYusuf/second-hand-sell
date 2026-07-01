import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Conversation } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// GET /api/messages/unread-count — total unread messages across all conversations
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }

    await connectDB()

    const conversations = await Conversation.find({ participants: authUser.userId })
    const count = conversations.reduce((sum, c) => {
      const uc = (c.unreadCount as Record<string, number>) || {}
      return sum + (uc[authUser.userId] || 0)
    }, 0)

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error('GET /api/messages/unread-count error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
