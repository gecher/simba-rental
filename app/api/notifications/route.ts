import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      // Keep track of this connection
      console.log(`Client connected: ${userId}`)

      // Send initial message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`))

      // Handle client disconnect
      request.signal.addEventListener("abort", () => {
        console.log(`Client disconnected: ${userId}`)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
} 