import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Product } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const post = await Product.findById(id)
    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check auth token
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
    const { id } = await params

    // Find post first to check ownership
    const existingPost = await Product.findById(id)
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Only owner of post or admin can edit
    if (
      existingPost.userId !== user.userId &&
      user.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, error: 'Not allowed to edit this post' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const post = await Product.findByIdAndUpdate(
      id,
      { ...body, userId: existingPost.userId },
      { new: true }
    )

    return NextResponse.json({ success: true, post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check auth token
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
    const { id } = await params

    // Find post first to check ownership
    const existingPost = await Product.findById(id)
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Only owner of post or admin can delete
    if (
      existingPost.userId !== user.userId &&
      user.role !== 'admin'
    ) {
      return NextResponse.json(
        { success: false, error: 'Not allowed to delete this post' },
        { status: 403 }
      )
    }

    await Product.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
