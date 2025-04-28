import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG and WebP are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate unique filename
    const uniqueId = crypto.randomBytes(16).toString("hex")
    const extension = file.type.split("/")[1]
    const filename = `${uniqueId}.${extension}`
    
    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads")
    await writeFile(join(uploadDir, filename), buffer)
    
    // Return the URL for the uploaded file
    const fileUrl = `/uploads/${filename}`
    
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    )
  }
} 