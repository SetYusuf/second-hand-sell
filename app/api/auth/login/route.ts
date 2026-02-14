import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = await getDatabase()
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email: body.email })
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(body.password, user.password)
    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
