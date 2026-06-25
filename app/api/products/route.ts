import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Product, IProduct } from '@/lib/models'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    console.log('📍 GET /api/products called')
    await connectDB()
    console.log('✅ Connected to MongoDB')
    
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''

    const query: any = {}
    if (search) {
      query.title = { $regex: search, $options: 'i' }
    }
    if (type) {
      query.type = type
    }

    const posts = await Product.find(query).sort({ createdAt: -1 })
    console.log(`✅ Found ${posts.length} posts`)
    
    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('❌ GET products error:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('📍 POST /api/products called')
    
    // Step 1: Check token
    const token = getTokenFromRequest(req)
    console.log('🔐 Token exists:', !!token)
    
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json(
        { success: false, error: 'Login required to post' },
        { status: 401 }
      )
    }

    // Step 2: Verify token
    const user = verifyToken(token)
    console.log('👤 User from token:', user ? user.userId : 'INVALID')
    
    if (!user) {
      console.log('❌ Token verification failed')
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Step 3: Get request body
    const body = await req.json()
    console.log('📝 Request body:', body)

    // Step 4: Validate required fields
    const required = [
      'title','type','brand','condition','price',
      'location','contactName','contactPhone','contactEmail'
    ]
    
    for (const field of required) {
      if (!body[field]) {
        console.log(`❌ Missing required field: ${field}`)
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    console.log('✅ All required fields present')

    // Step 5: Connect to database
    console.log('🔌 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ Connected to MongoDB')

    // Step 6: Create post
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
    
    console.log('💾 Creating post with data:', postData)
    const post = await Product.create(postData)
    console.log('✅ Post created successfully:', post._id)

    return NextResponse.json(
      { success: true, post },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ POST products error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}