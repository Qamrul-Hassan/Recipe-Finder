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

export const fetchRecipes = async (keywords: string[]): Promise<Recipe[]> => {
  try {
    const keyword = keywords?.[0] || ''
    const mealUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`
    const drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${keyword}`

    const [mealRes, drinkRes] = await Promise.all([fetch(mealUrl), fetch(drinkUrl)])
    const mealData = await mealRes.json()
    const drinkData = await drinkRes.json()

    const meals: Recipe[] = mealData.meals || []
    const drinks: Recipe[] = drinkData.drinks || []

    // If drinks is null, we set it as empty array to avoid errors
    const validDrinks: Recipe[] = Array.isArray(drinks) ? drinks : []

    return [...meals, ...validDrinks]
  } catch (err) {
    console.error('Error fetching recipes:', err)
    return []
  }
}
