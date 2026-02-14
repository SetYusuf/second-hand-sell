import { getDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email: body.email })
    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const result = await users.insertOne({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date()
    })

    return Response.json({
      success: true,
      id: result.insertedId
    })

  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
