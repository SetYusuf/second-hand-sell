import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Product } from '@/lib/models'

// GET /api/products/seller/:sellerID — Returns all products posted by a seller
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sellerID: string }> }
) {
  try {
    const { sellerID } = await params

    if (!sellerID) {
      return NextResponse.json(
        { success: false, error: 'Seller ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Optional query param to exclude a specific product (e.g. current product)
    const { searchParams } = new URL(req.url)
    const excludeId = searchParams.get('exclude')

    const query: { userId: string; _id?: { $ne: string } } = { userId: sellerID }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }

    const posts = await Product.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('GET /api/products/seller/:sellerID error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}