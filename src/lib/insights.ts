import { Recipe } from '@/lib/api'
import { getRecipeCategory, getRecipeId, getRecipeImage, getRecipeTitle } from '@/lib/recipe'

type TrackedKind = 'meal' | 'drink'

interface TrackedRecipePayload {
  id: string
  title: string
  image: string
  category: string
  kind: TrackedKind
}

const toPayload = (recipe: Recipe): TrackedRecipePayload | null => {
  const id = getRecipeId(recipe)
  if (!id) return null

  return {
    id,
    title: getRecipeTitle(recipe),
    image: getRecipeImage(recipe),
    category: getRecipeCategory(recipe),
    kind: recipe.idDrink ? 'drink' : 'meal',
  }
}

export const recordRecipeView = async (recipe: Recipe): Promise<void> => {
  const payload = toPayload(recipe)
  if (!payload) return

  try {
    await fetch('/api/insights/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Fail silently: view tracking should never break browsing.
  }
}

export const getMostlyCheckedRecipes = async (limit = 8): Promise<Recipe[]> => {
  try {
    const response = await fetch(`/api/insights/mostly-checked?limit=${encodeURIComponent(String(limit))}`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) return []
    const data = (await response.json()) as { recipes?: Recipe[] }
    return Array.isArray(data.recipes) ? data.recipes : []
  } catch {
    return []
  }
}
