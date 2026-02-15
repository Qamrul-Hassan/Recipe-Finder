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

interface InternalRecipesResponse {
  recipes?: Recipe[]
}

const REGION_TO_AREAS: Record<string, string[]> = {
  asian: ['Chinese', 'Indian', 'Japanese', 'Thai', 'Vietnamese', 'Malaysian', 'Filipino'],
  middle_eastern: ['Turkish', 'Moroccan', 'Egyptian', 'Tunisian'],
  western: ['American', 'British', 'French', 'Italian', 'Spanish', 'Canadian', 'Portuguese'],
}

const COUNTRY_POPULAR_TERMS: Record<string, string[]> = {
  american: ['burger', 'bbq', 'steak'],
  british: ['pie', 'fish', 'pudding'],
  spanish: ['paella', 'tortilla', 'chorizo'],
  indian: ['biryani', 'curry', 'masala'],
  japanese: ['sushi', 'ramen', 'teriyaki'],
  thai: ['pad thai', 'green curry', 'tom yum'],
  italian: ['pasta', 'risotto', 'pizza'],
  french: ['ratatouille', 'beef bourguignon', 'crepe'],
  mexican: ['taco', 'enchilada', 'quesadilla'],
  chinese: ['noodle', 'dumpling', 'sweet and sour'],
  korean: ['kimchi', 'bulgogi', 'bibimbap'],
  vietnamese: ['pho', 'spring roll', 'banh mi'],
  greek: ['moussaka', 'souvlaki', 'salad'],
  lebanese: ['shawarma', 'hummus', 'kebab'],
  moroccan: ['tagine', 'couscous', 'harira'],
  brazilian: ['feijoada', 'picanha', 'moqueca'],
  portuguese: ['bacalhau', 'caldo verde', 'piri piri'],
  turkish: ['kebab', 'kofta', 'pilaf'],
  bangladeshi: ['hilsa', 'ilish', 'khichuri', 'bhuna', 'korma', 'pulao', 'kacchi', 'fuchka', 'chotpoti'],
  bangladesh: ['hilsa', 'ilish', 'khichuri', 'bhuna', 'korma', 'pulao', 'kacchi', 'fuchka', 'chotpoti'],
  pakistani: ['nihari', 'karahi', 'biryani'],
  pakistan: ['nihari', 'karahi', 'biryani'],
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

const FRUIT_DRINK_TERMS = [
  'smoothie',
  'juice',
  'lemonade',
  'orange',
  'pineapple',
  'mango',
  'berry',
  'banana',
  'apple',
]

const VEGETABLE_DRINK_TERMS = [
  'vegetable',
  'tomato',
  'carrot',
  'celery',
  'cucumber',
  'beet',
  'green',
]

const ALL_DRINK_TERMS = Array.from(new Set([...FRUIT_DRINK_TERMS, ...VEGETABLE_DRINK_TERMS]))
const TEA_DRINK_TERMS = ['tea', 'iced tea', 'chai', 'matcha', 'herbal tea']
const BROAD_DRINK_TERMS = Array.from(new Set([...ALL_DRINK_TERMS, ...TEA_DRINK_TERMS]))
const COFFEE_DRINK_TERMS = ['coffee', 'espresso', 'latte', 'cappuccino', 'mocha', 'americano', 'macchiato']
const COFFEE_TEA_DRINK_TERMS = Array.from(new Set([...COFFEE_DRINK_TERMS, ...TEA_DRINK_TERMS]))
const TEA_INGREDIENT_TERMS = ['tea', 'tea bag']
const COFFEE_INGREDIENT_TERMS = ['coffee', 'espresso', 'coffee liqueur']
const COFFEE_TEA_INGREDIENT_TERMS = Array.from(
  new Set([...TEA_INGREDIENT_TERMS, ...COFFEE_INGREDIENT_TERMS]),
)

const fetchCuratedDrinks = async (terms: string[], max = 24): Promise<Recipe[]> => {
  const requests = terms.map((term) =>
    getJsonSafely<DrinkSearchResponse>(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`,
    ),
  )

  const results = await Promise.all(requests)
  const drinks = results.flatMap((data) => (Array.isArray(data?.drinks) ? data.drinks : []))
  return uniqueById(drinks).slice(0, max)
}

const fetchDrinksByIngredients = async (ingredients: string[], max = 24): Promise<Recipe[]> => {
  const requests = ingredients.map((ingredient) =>
    getJsonSafely<DrinkSearchResponse>(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`,
    ),
  )

  const results = await Promise.all(requests)
  const drinks = results.flatMap((data) => (Array.isArray(data?.drinks) ? data.drinks : []))
  return uniqueById(drinks).slice(0, max)
}

const isAnyDrinkKeyword = (keyword: string): boolean => ['drink', 'drinks'].includes(keyword)
const isFruitDrinkKeyword = (keyword: string): boolean =>
  ['fruit drink', 'fruit drinks', 'fruity drink', 'fruity drinks'].includes(keyword)
const isVegetableDrinkKeyword = (keyword: string): boolean =>
  ['vegetable drink', 'vegetable drinks', 'veggie drink', 'veggie drinks'].includes(keyword)
const isCoffeeTeaKeyword = (keyword: string): boolean =>
  [
    'coffee',
    'tea',
    'coffee and tea',
    'coffee & tea',
    'tea and coffee',
    'espresso',
    'latte',
    'cappuccino',
    'mocha',
    'americano',
    'macchiato',
    'chai',
    'matcha',
    'iced tea',
    'herbal tea',
  ].includes(keyword)

const fetchByAreas = async (regions: string[]): Promise<Recipe[]> => {
  const areas = resolveAreas(regions)
  const normalizedRegions = regions.map((region) => region.toLowerCase())

  const areaRequests =
    areas.length > 0
      ? areas.map((area) =>
          getJsonSafely<MealSearchResponse>(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`,
          ),
        )
      : []

  const searchTerms = Array.from(new Set(normalizedRegions.flatMap((region) => COUNTRY_POPULAR_TERMS[region] ?? [])))

  const searchRequests =
    searchTerms.length > 0
      ? searchTerms.map((term) =>
          getJsonSafely<MealSearchResponse>(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`,
          ),
        )
      : []

  const [areaResults, searchResults] = await Promise.all([
    Promise.all(areaRequests),
    Promise.all(searchRequests),
  ])

  const areaMeals = areaResults.flatMap((data) => (Array.isArray(data?.meals) ? data.meals : []))
  const searchedMeals = searchResults.flatMap((data) => (Array.isArray(data?.meals) ? data.meals : []))
  const rankedSearchedMeals =
    searchTerms.length > 0
      ? (() => {
          const termSet = searchTerms.map((term) => term.toLowerCase())
          const scoreRecipeByTerms = (recipe: Recipe): number => {
            const title = (recipe.strMeal || '').toLowerCase()
            const category = (recipe.strCategory || '').toLowerCase()
            const instructions = (recipe.strInstructions || '').toLowerCase()
            const area = (recipe.strArea || '').toLowerCase()
            const joined = `${title} ${category} ${instructions} ${area}`

            return termSet.reduce((score, term) => (joined.includes(term) ? score + 1 : score), 0)
          }

          return searchedMeals
            .map((meal) => ({ meal, score: scoreRecipeByTerms(meal) }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((item) => item.meal)
        })()
      : searchedMeals
  const baseResults = uniqueById([...areaMeals, ...rankedSearchedMeals]).slice(0, 36)

  const spoonacularRequests = regions.map((region) =>
    getJsonSafely<InternalRecipesResponse>(
      `/api/spoonacular/country?country=${encodeURIComponent(region)}&limit=18`,
    ),
  )
  const spoonacularResults = await Promise.all(spoonacularRequests)
  const spoonacularMeals = spoonacularResults.flatMap((data) =>
    Array.isArray(data?.recipes) ? data.recipes : [],
  )

  return uniqueById([...baseResults, ...spoonacularMeals]).slice(0, 36)
}

export const fetchRecipes = async (
  keywords: string[],
  options: FetchRecipesOptions = {},
): Promise<Recipe[]> => {
  try {
    const keyword = (keywords?.[0] || '').trim()
    const normalizedKeyword = keyword.toLowerCase()
    const regions = options.regions?.filter(Boolean) || []

    if (!keyword && regions.length > 0) {
      const regionalRecipes = await fetchByAreas(regions)
      if (regionalRecipes.length > 0) return regionalRecipes
      // Explicitly return empty when country/region has no upstream data.
      return []
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

    if (isAnyDrinkKeyword(normalizedKeyword)) {
      return await fetchCuratedDrinks(BROAD_DRINK_TERMS)
    }

    if (isFruitDrinkKeyword(normalizedKeyword)) {
      return await fetchCuratedDrinks(FRUIT_DRINK_TERMS)
    }

    if (isVegetableDrinkKeyword(normalizedKeyword)) {
      return await fetchCuratedDrinks(VEGETABLE_DRINK_TERMS)
    }

    if (isCoffeeTeaKeyword(normalizedKeyword)) {
      const byIngredients = await fetchDrinksByIngredients(COFFEE_TEA_INGREDIENT_TERMS)
      if (byIngredients.length > 0) return byIngredients
      return await fetchCuratedDrinks(COFFEE_TEA_DRINK_TERMS)
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
