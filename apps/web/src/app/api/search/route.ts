/**
 * app/api/search/route.ts — Next.js API route for search
 *
 * WHAT IS A NEXT.JS API ROUTE?
 *   A server-side endpoint that lives inside your Next.js app.
 *   This one handles POST /api/search requests from the frontend.
 *
 *   It's a thin proxy that forwards the search request to the
 *   FastAPI retrieval service and returns the results.
 *
 * WHY NOT CALL FASTAPI DIRECTLY FROM THE BROWSER?
 *   You can — and for the MVP we do via api-client.ts.
 *   API routes become useful when you need to:
 *   - Add auth headers the browser shouldn't hold
 *   - Transform data before sending to the client
 *   - Keep service URLs private from the browser
 *
 * DOCS: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 */

import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward to FastAPI retrieval service
    const response = await fetch(`${API_URL}/retrieve/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })

  } catch (error) {
    console.error('Search proxy error:', error)
    return NextResponse.json(
      { error: 'Search service unavailable' },
      { status: 503 }
    )
  }
}
