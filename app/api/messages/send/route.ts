import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getDB } from '@/lib/db'
import { Message, Conversation } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'


// POST /api/messages/send
// Body: { receiverId, text }
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    const authUser = verifyToken(token)
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }

    const body = await req.json()
    const { receiverId, text } = body

    if (!receiverId || !text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'receiverId and text are required' }, { status: 400 })
    }

    if (receiverId === authUser.userId) {
      return NextResponse.json({ success: false, error: 'Cannot message yourself' }, { status: 400 })
    }

    await connectDB()

    // Find or create the conversation

    let conversation = await Conversation.findOne({
      participants: { $all: [authUser.userId, receiverId], $size: 2 },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [authUser.userId, receiverId],
        lastMessage: text.trim(),
        lastMessageAt: new Date(),
        unreadCount: { [receiverId]: 1 },
      })
    } else {
      const currentUnread = (conversation.unreadCount as Record<string, number>) || {}
      const newUnread = {
        ...currentUnread,
        [receiverId]: (currentUnread[receiverId] || 0) + 1,
      }
      conversation.lastMessage = text.trim()
      conversation.lastMessageAt = new Date()
      conversation.unreadCount = newUnread
      await conversation.save()
    }

    const message = await Message.create({
      conversationId: conversation._id.toString(),
      senderId: authUser.userId,
      receiverId,
      text: text.trim(),
      read: false,
    })

    // Fetch sender info for the payload
    const db = await getDB()
    let senderInfo: { name?: string; avatar?: string } = {}
    if (db) {
      const senderDoc = await db.collection('users').findOne(
        { _id: new mongoose.Types.ObjectId(authUser.userId) },
        { projection: { name: 1, avatar: 1 } }
      )
      if (senderDoc) {
        senderInfo = { name: senderDoc.name, avatar: senderDoc.avatar || '' }
      }
    }

    const messagePayload = {
      _id: message._id.toString(),
      conversationId: conversation._id.toString(),
      senderId: authUser.userId,
      receiverId,
      text: message.text,
      read: false,
      createdAt: message.createdAt,
      sender: senderInfo,
    }

    // Message is saved to DB. The receiver's client will fetch it on next polling interval (3-4 seconds).
    // No real-time socket emit needed.

    return NextResponse.json({ success: true, message: messagePayload, conversationId: conversation._id.toString() })
  } catch (error) {
    console.error('POST /api/messages/send error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

