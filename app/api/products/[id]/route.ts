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
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }
    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }

    await connectDB()
    const { id } = await params
    const existingPost = await Product.findById(id)
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }
    if (existingPost.userId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Not allowed to edit this post' }, { status: 403 })
    }

    const body = await req.json()
    const post = await Product.findByIdAndUpdate(id, { ...body, userId: existingPost.userId }, { new: true })
    return NextResponse.json({ success: true, post })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

// PATCH /api/products/:id — Update product status/featured (admin)
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

    await connectDB()
    const { id } = await params
    const body = await req.json()
    const update: Record<string, unknown> = {}

    if (body.status && ['active', 'removed', 'pending', 'rejected'].includes(body.status)) {
      update.status = body.status
    }
    if (typeof body.featured === 'boolean') {
      update.featured = body.featured
    }
    if (body.rejectReason !== undefined) {
      update.rejectReason = body.rejectReason
    }
    if (body.title) update.title = body.title
    if (body.price !== undefined) update.price = Number(body.price)
    if (body.type) update.type = body.type
    if (body.brand) update.brand = body.brand
    if (body.condition) update.condition = body.condition
    if (body.description !== undefined) update.description = body.description
    if (body.location) update.location = body.location
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 })
    }

    const post = await Product.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('PATCH /api/products/:id error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
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

    await connectDB()
    const { id } = await params
    const existingPost = await Product.findById(id)
    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }
    if (existingPost.userId !== user.userId && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Not allowed to delete this post' }, { status: 403 })
    }

    await Product.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
