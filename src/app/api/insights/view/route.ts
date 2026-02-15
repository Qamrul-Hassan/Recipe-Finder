import { NextRequest, NextResponse } from 'next/server'
import { addRecipeView, TrackedRecipePayload } from '@/lib/server/insights-store'

export const runtime = 'nodejs'

const isValidPayload = (value: unknown): value is TrackedRecipePayload => {
  if (!value || typeof value !== 'object') return false

  const payload = value as Partial<TrackedRecipePayload>
  return (
    typeof payload.id === 'string' &&
    typeof payload.title === 'string' &&
    typeof payload.image === 'string' &&
    typeof payload.category === 'string' &&
    (payload.kind === 'meal' || payload.kind === 'drink')
  )
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await addRecipeView(body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unable to record view' }, { status: 500 })
  }
}
