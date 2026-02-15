import { NextRequest, NextResponse } from 'next/server'
import { Recipe } from '@/lib/api'
import { getTopRecipes } from '@/lib/server/insights-store'

export const runtime = 'nodejs'

const toRecipe = (item: {
  id: string
  title: string
  image: string
  category: string
  kind: 'meal' | 'drink'
}): Recipe => {
  if (item.kind === 'drink') {
    return {
      idDrink: item.id,
      strDrink: item.title,
      strDrinkThumb: item.image,
      strCategory: item.category,
    }
  }

  return {
    idMeal: item.id,
    strMeal: item.title,
    strMealThumb: item.image,
    strCategory: item.category,
  }
}

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get('limit')
    const limit = limitParam ? Number(limitParam) : 8
    const topRecipes = await getTopRecipes(limit)
    const recipes = topRecipes.map(toRecipe)

    return NextResponse.json({ recipes })
  } catch {
    return NextResponse.json({ recipes: [] }, { status: 500 })
  }
}
