import { NextRequest, NextResponse } from 'next/server'
import { connectDB, getDB } from '@/lib/db'
import { Product } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import mongoose from 'mongoose'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const includeRemoved = searchParams.get('includeRemoved') === 'true'

    const query: Record<string, unknown> = {}
    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }
    if (type) {
      query.type = type
    }
    if (!includeRemoved) {
      query.status = { $ne: 'removed' }
    }

    const posts = await Product.find(query).sort({ createdAt: -1 })

    // Populate seller info for each post
    const db = await getDB()
    if (db) {
      const userIds = [...new Set(posts.map((p) => p.userId).filter(Boolean))] as string[]
      const objectIds: mongoose.Types.ObjectId[] = []
      for (const id of userIds) {
        try { objectIds.push(new mongoose.Types.ObjectId(id)) } catch { /* skip invalid */ }
      }
      const users = await db.collection('users')
        .find({ _id: { $in: objectIds } })
        .project({ name: 1, email: 1, avatar: 1, role: 1, status: 1 })
        .toArray()

      const userMap: Record<string, { name: string; email: string; avatar: string; role: string; status: string }> = {}
      users.forEach((u) => {
        userMap[u._id.toString()] = {
          name: u.name,
          email: u.email,
          avatar: u.avatar || '',
          role: u.role || 'user',
          status: u.status || 'active',
        }
      })

      const postsWithSeller = posts.map((p) => {
        const seller = userMap[p.userId] || null
        return {
          ...p.toObject(),
          seller: seller || null,
        }
      })

      return NextResponse.json({ success: true, posts: postsWithSeller })
    }

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('GET products error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Login required to post' },
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

    const body = await req.json()

    const required = [
      'title','type','brand','condition','price',
      'location','contactName','contactPhone','contactEmail'
    ]

    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    await connectDB()

    const postData = {
      title: body.title,
      type: body.type,
      brand: body.brand,
      specs: body.specs || '',
      condition: body.condition,
      price: Number(body.price),
      description: body.description || '',
      location: body.location,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      imageUrl: body.imageUrl || '',
      userId: user.userId
    }

    const post = await Product.create(postData)

    return NextResponse.json(
      { success: true, post },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST products error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}
