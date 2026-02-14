// src/lib/api.ts
export interface Recipe {
  idMeal?: string
  idDrink?: string
  strMeal?: string
  strDrink?: string
  strCategory?: string
  strArea?: string
  strInstructions?: string
  strMealThumb?: string
  strDrinkThumb?: string
  strYoutube?: string
  [key: string]: string | undefined
}

interface FetchRecipesOptions {
  regions?: string[]
}

interface MealSearchResponse {
  meals?: Recipe[]
}

interface DrinkSearchResponse {
  drinks?: Recipe[]
}

const REGION_TO_AREAS: Record<string, string[]> = {
  asian: ['Chinese', 'Indian', 'Japanese', 'Thai', 'Vietnamese', 'Malaysian', 'Filipino'],
  middle_eastern: ['Turkish', 'Moroccan', 'Egyptian', 'Tunisian'],
  western: ['American', 'British', 'French', 'Italian', 'Spanish', 'Canadian', 'Portuguese'],
}

const getJsonSafely = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url)
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

const uniqueById = (items: Recipe[]): Recipe[] => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const id = item.idMeal || item.idDrink
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

const resolveAreas = (regions: string[]): string[] => {
  const areas = new Set<string>()
  regions.forEach((region) => {
    const key = region.toLowerCase()
    if (REGION_TO_AREAS[key]) {
      REGION_TO_AREAS[key].forEach((area) => areas.add(area))
      return
    }
    areas.add(region)
  })
  return Array.from(areas)
}

const fetchByAreas = async (regions: string[]): Promise<Recipe[]> => {
  const areas = resolveAreas(regions)
  if (areas.length === 0) return []

  const requests = areas.map((area) =>
    getJsonSafely<MealSearchResponse>(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`,
    ),
  )

  const results = await Promise.all(requests)
  const meals = results.flatMap((data) => (Array.isArray(data?.meals) ? data.meals : []))
  return uniqueById(meals).slice(0, 36)
}

export const fetchRecipes = async (
  keywords: string[],
  options: FetchRecipesOptions = {},
): Promise<Recipe[]> => {
  try {
    const keyword = (keywords?.[0] || '').trim()
    const regions = options.regions?.filter(Boolean) || []

    if (!keyword && regions.length > 0) {
      const regionalRecipes = await fetchByAreas(regions)
      if (regionalRecipes.length > 0) return regionalRecipes
      // Fallback keeps the homepage usable when area endpoints are unavailable.
      return await fetchRecipes([''])
    }

    if (!keyword) {
      const popularMealTerms = ['chicken', 'pasta', 'beef']
      const popularDrinkTerms = ['margarita', 'mojito', 'cocktail']

      const mealRequests = popularMealTerms.map((term) =>
        getJsonSafely<MealSearchResponse>(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`),
      )
      const drinkRequests = popularDrinkTerms.map((term) =>
        getJsonSafely<DrinkSearchResponse>(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`),
      )

      const [mealResults, drinkResults] = await Promise.all([
        Promise.all(mealRequests),
        Promise.all(drinkRequests),
      ])

      const meals = mealResults.flatMap((data) => (Array.isArray(data?.meals) ? data.meals : []))
      const drinks = drinkResults.flatMap((data) => (Array.isArray(data?.drinks) ? data.drinks : []))
      return uniqueById([...meals, ...drinks]).slice(0, 24)
    }

    const [mealData, drinkData] = await Promise.all([
      getJsonSafely<MealSearchResponse>(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`),
      getJsonSafely<DrinkSearchResponse>(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`),
    ])

    const meals: Recipe[] = Array.isArray(mealData?.meals) ? mealData.meals : []
    const drinks: Recipe[] = Array.isArray(drinkData?.drinks) ? drinkData.drinks : []

    return uniqueById([...meals, ...drinks])
  } catch (err) {
    console.error('Error fetching recipes:', err)
    return []
  }
}
