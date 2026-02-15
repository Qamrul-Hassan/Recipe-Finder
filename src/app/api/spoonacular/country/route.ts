import { NextRequest, NextResponse } from 'next/server'
import { fetchSpoonacularCountryRecipes } from '@/lib/server/spoonacular'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const country = request.nextUrl.searchParams.get('country')?.trim()
    const limitParam = request.nextUrl.searchParams.get('limit')
    const limit = limitParam ? Number(limitParam) : 24

    if (!country) {
      return NextResponse.json({ recipes: [] }, { status: 400 })
    }

    const recipes = await fetchSpoonacularCountryRecipes(country, Number.isFinite(limit) ? limit : 24)
    return NextResponse.json({ recipes })
  } catch {
    return NextResponse.json({ recipes: [] }, { status: 500 })
  }
}
