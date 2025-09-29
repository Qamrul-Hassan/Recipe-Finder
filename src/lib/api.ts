export interface Recipe {
  id: string
  title: string
  image: string
}

interface SpoonacularRecipe {
  id: number
  title: string
  image?: string
}

interface APIResponse {
  results?: SpoonacularRecipe[]
}

export async function fetchRecipes(query: string): Promise<Recipe[]> {
  const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch'
  const API_KEY = '6a6b64b883fd4968beb466488057a5b5'

  try {
    const res = await fetch(
      `${BASE_URL}?query=${query}&number=12&type=main+course&apiKey=${API_KEY}`
    )
    const data: APIResponse = await res.json()

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      // fallback recipes if API returns nothing
      return [
        { id: '1', title: 'Chicken Curry', image: '/fallback.png' },
        { id: '2', title: 'Pasta Salad', image: '/fallback.png' },
        { id: '3', title: 'Grilled Salmon', image: '/fallback.png' },
        { id: '4', title: 'Vegan Bowl', image: '/fallback.png' },
      ]
    }

    return data.results.map((r: SpoonacularRecipe) => ({
      id: r.id.toString(),
      title: r.title,
      image: r.image || '/fallback.png',
    }))
  } catch (err) {
    console.error('Error fetching recipes:', err)
    // return fallback if fetch fails
    return [
      { id: '1', title: 'Chicken Curry', image: '/fallback.png' },
      { id: '2', title: 'Pasta Salad', image: '/fallback.png' },
      { id: '3', title: 'Grilled Salmon', image: '/fallback.png' },
      { id: '4', title: 'Vegan Bowl', image: '/fallback.png' },
    ]
  }
}
