import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, url } = body

    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID
    const apiKey = process.env.ONESIGNAL_REST_API_KEY

    if (!appId || !apiKey) {
      return NextResponse.json(
        { success: false, message: 'OneSignal not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['Subscribed Users'],
        headings: { en: title || 'New Story' },
        contents: { en: message || 'Check out our latest story!' },
        url: url || 'https://heavy-status.com',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: 'Failed to send notification', error: result },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: result.id })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
