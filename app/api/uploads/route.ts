import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file' }, { status: 400 })
    }

    // Validate type and size
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 })
    }
    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      return NextResponse.json({ success: false, error: 'File too large' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, new Uint8Array(buffer), { access: 'public' })

    return NextResponse.json({
      success: true,
      url: blob.url,
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}

