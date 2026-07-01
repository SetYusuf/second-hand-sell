import { NextRequest, NextResponse } from 'next/server'
import { connectDB, getDB } from '@/lib/db'
import { Conversation } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/messages/conversations — all conversations for the logged-in user
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
    const db = await getDB()

    const conversations = await Conversation.find({ participants: authUser.userId })
      .sort({ lastMessageAt: -1 })

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const otherId = conv.participants.find((p: string) => p !== authUser.userId) || ''
        let otherUser: { id: string; name: string; avatar: string } = {
          id: otherId,
          name: 'Unknown User',
          avatar: '',
        }

        if (db && otherId && mongoose.isValidObjectId(otherId)) {
          const userDoc = await db.collection('users').findOne(
            { _id: new mongoose.Types.ObjectId(otherId) },
            { projection: { name: 1, avatar: 1 } }
          )
          if (userDoc) {
            otherUser = {
              id: otherId,
              name: userDoc.name || 'Unknown User',
              avatar: userDoc.avatar || '',
            }
          }
        }

        const unreadCount = ((conv.unreadCount as Record<string, number>) || {})[authUser.userId] || 0

        return {
          _id: conv._id.toString(),
          participant: otherUser,
          lastMessage: conv.lastMessage || '',
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        }
      })
    )

    return NextResponse.json({ success: true, conversations: results })
  } catch (error) {
    console.error('GET /api/messages/conversations error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
