import type { Recipe } from '@/lib/api'

const RAPID_HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
const BASE_URL = `https://${RAPID_HOST}`

interface SpoonacularSearchItem {
  id: number
  title: string
  image?: string
  dishTypes?: string[]
  cuisines?: string[]
  summary?: string
}

interface SpoonacularSearchResponse {
  results?: SpoonacularSearchItem[]
}

interface SpoonacularRandomResponse {
  recipes?: SpoonacularSearchItem[]
}

interface SpoonacularRecipeDetails {
  id: number
  title: string
  image?: string
  dishTypes?: string[]
  cuisines?: string[]
  summary?: string
  instructions?: string
}

const COUNTRY_TO_CUISINE: Record<string, string> = {
  american: 'american',
  bangladeshi: 'asian',
  bangladesh: 'asian',
  brazilian: 'latin american',
  british: 'british',
  chinese: 'chinese',
  french: 'french',
  greek: 'mediterranean',
  indian: 'indian',
  italian: 'italian',
  japanese: 'japanese',
  korean: 'korean',
  mexican: 'mexican',
  moroccan: 'african',
  portuguese: 'mediterranean',
  spanish: 'spanish',
  thai: 'thai',
  turkish: 'middle eastern',
  vietnamese: 'vietnamese',
}

const COUNTRY_QUERY_HINT: Record<string, string> = {
  bangladeshi: 'biryani',
  bangladesh: 'biryani',
  brazilian: 'feijoada',
  pakistani: 'pakistani',
  pakistan: 'pakistani',
}

const COUNTRY_QUERY_TERMS: Record<string, string[]> = {
  bangladeshi: ['biryani', 'rice', 'curry', 'lentil'],
  bangladesh: ['biryani', 'rice', 'curry', 'lentil'],
  brazilian: ['feijoada', 'moqueca', 'picanha', 'cassava'],
}

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getHeaders = (): HeadersInit | null => {
  const key = process.env.RAPIDAPI_KEY
  if (!key) return null

  return {
    'x-rapidapi-key': key,
    'x-rapidapi-host': RAPID_HOST,
  }
}

const toRecipe = (item: SpoonacularSearchItem | SpoonacularRecipeDetails, countryHint = ''): Recipe => ({
  idMeal: `spoon-${item.id}`,
  strMeal: item.title,
  strMealThumb: item.image || '/local-food-placeholder.svg',
  strCategory: item.dishTypes?.[0] || 'Meal',
  strArea: item.cuisines?.[0] || countryHint,
  strInstructions:
    'instructions' in item && item.instructions
      ? stripHtml(item.instructions)
      : item.summary
        ? stripHtml(item.summary)
        : '',
})

const searchComplex = async (
  headers: HeadersInit,
  params: URLSearchParams,
  countryHint: string,
): Promise<Recipe[]> => {
  const response = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`, {
    headers,
    cache: 'no-store',
  })
  if (!response.ok) return []
  const data = (await response.json()) as SpoonacularSearchResponse
  const results = Array.isArray(data.results) ? data.results : []
  return results.map((item) => toRecipe(item, countryHint))
}

const fetchRandomFallback = async (headers: HeadersInit, number: number, countryHint: string): Promise<Recipe[]> => {
  const params = new URLSearchParams({
    number: String(Math.min(number, 12)),
    tags: 'main course',
  })
  const response = await fetch(`${BASE_URL}/recipes/random?${params.toString()}`, {
    headers,
    cache: 'no-store',
  })
  if (!response.ok) return []
  const data = (await response.json()) as SpoonacularRandomResponse
  const results = Array.isArray(data.recipes) ? data.recipes : []
  return results.map((item) => toRecipe(item, countryHint))
}

export const fetchSpoonacularCountryRecipes = async (country: string, number = 24): Promise<Recipe[]> => {
  const headers = getHeaders()
  if (!headers) return []

  const normalized = country.trim().toLowerCase()
  const cuisine = COUNTRY_TO_CUISINE[normalized]
  const queryHint = COUNTRY_QUERY_HINT[normalized] || normalized

  try {
    const baseParams = new URLSearchParams({
      number: String(number),
      addRecipeInformation: 'true',
      sort: 'popularity',
    })

    if (cuisine) {
      const cuisineParams = new URLSearchParams(baseParams)
      cuisineParams.set('cuisine', cuisine)
      const byCuisine = await searchComplex(headers, cuisineParams, country)
      if (byCuisine.length > 0) return byCuisine
    }

    const termCandidates = COUNTRY_QUERY_TERMS[normalized] || [queryHint]
    for (const term of termCandidates) {
      const queryParams = new URLSearchParams(baseParams)
      queryParams.set('query', term)
      const byQuery = await searchComplex(headers, queryParams, country)
      if (byQuery.length > 0) return byQuery
    }

    return await fetchRandomFallback(headers, number, country)
  } catch {
    return []
  }
}

export const fetchSpoonacularRecipeDetails = async (id: string): Promise<Recipe | null> => {
  const headers = getHeaders()
  if (!headers) return null

  try {
    const response = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(id)}/information`, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) return null
    const data = (await response.json()) as SpoonacularRecipeDetails
    return toRecipe(data)
  } catch {
    return null
  }
}
