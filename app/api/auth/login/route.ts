import { getDB } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.email || !body.password) {
      return Response.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    const db = await getDB()
    if (!db) {
      return Response.json({ error: "Database connection failed" }, { status: 500 })
    }
    const users = db.collection("users")

    const user = await users.findOne({ email: body.email })
    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password)
    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    })

    return Response.json({
      success: true,
      token: token,
      user: {
        id: user._id.toString(),
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
