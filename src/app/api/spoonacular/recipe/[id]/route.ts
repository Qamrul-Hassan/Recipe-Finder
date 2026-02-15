import { NextResponse } from 'next/server'
import { fetchSpoonacularRecipeDetails } from '@/lib/server/spoonacular'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const recipe = await fetchSpoonacularRecipeDetails(id)
    if (!recipe) {
      return NextResponse.json({ recipe: null }, { status: 404 })
    }

    return NextResponse.json({ recipe })
  } catch {
    return NextResponse.json({ recipe: null }, { status: 500 })
  }
}
