// src/lib/api.ts

export interface Recipe {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strYoutube: string
  [key: string]: string // for strIngredient1..20, strMeasure1..20
}

/**
 * Fetch recipes from TheMealDB
 * @param ingredients string array, for search pass [keyword]
 */
export const fetchRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MEALDB_API_KEY || '1'
    let url = ''

    if (!ingredients || ingredients.length === 0 || ingredients[0] === '') {
      // default popular recipes
      url = `https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=`
    } else {
      // search by keyword (any recipe name)
      const query = ingredients[0]
      url = `https://www.themealdb.com/api/json/v1/${apiKey}/search.php?s=${query}`
    }

    const res = await fetch(url)
    const data: { meals: Recipe[] | null } = await res.json()

    if (!data.meals) return []

    return data.meals
  } catch (err) {
    console.error('Error fetching recipes:', err)
    return []
  }
}
