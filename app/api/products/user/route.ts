import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Product } from '@/lib/models'
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

    await connectDB()

    const posts = await Product.find({ userId: user.userId })
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID required' },
        { status: 400 }
      )
    }

    await connectDB()

    const post = await Product.findById(postId)
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.userId !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Not allowed' },
        { status: 403 }
      )
    }

    await Product.findByIdAndDelete(postId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}