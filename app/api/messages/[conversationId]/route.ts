import { NextRequest, NextResponse } from 'next/server'
import { connectDB, getDB } from '@/lib/db'
import { Message, Conversation } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/messages/:conversationId — full message history, marks as read
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
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

    const { conversationId } = await params

    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
      return NextResponse.json({ success: false, error: 'Invalid conversation ID' }, { status: 400 })
    }

    await connectDB()

    const conversation = await Conversation.findById(conversationId)
    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 })
    }

    if (!conversation.participants.includes(authUser.userId)) {
      return NextResponse.json({ success: false, error: 'Not authorized to view this conversation' }, { status: 403 })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 })

    // Mark messages addressed to the current user as read
    await Message.updateMany(
      { conversationId, receiverId: authUser.userId, read: false },
      { $set: { read: true } }
    )

    // Reset this user's unread count on the conversation
    const unreadCount = (conversation.unreadCount as Record<string, number>) || {}
    unreadCount[authUser.userId] = 0
    conversation.unreadCount = unreadCount
    await conversation.save()

    // Note: Socket.io emits removed. The sender will see the read status on their next polling interval.

    // Fetch other participant's info
    const db = await getDB()
    const otherId = conversation.participants.find((p: string) => p !== authUser.userId)
    let otherUser: { id: string; name: string; avatar: string } = { id: otherId || '', name: 'Unknown User', avatar: '' }
    if (db && otherId && mongoose.isValidObjectId(otherId)) {
      const userDoc = await db.collection('users').findOne(
        { _id: new mongoose.Types.ObjectId(otherId) },
        { projection: { name: 1, avatar: 1 } }
      )
      if (userDoc) {
        otherUser = { id: otherId, name: userDoc.name || 'Unknown User', avatar: userDoc.avatar || '' }
      }
    }

    return NextResponse.json({
      success: true,
      messages: messages.map((m) => ({
        _id: m._id.toString(),
        conversationId: m.conversationId,
        senderId: m.senderId,
        receiverId: m.receiverId,
        text: m.text,
        read: m.read,
        createdAt: m.createdAt,
      })),
      participant: otherUser,
    })
  } catch (error) {
    console.error('GET /api/messages/:conversationId error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

