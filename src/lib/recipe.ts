import { Recipe } from '@/lib/api'

export interface FavoriteRecipe {
  id: string
  title: string
  image: string
  category: string
  kind: 'meal' | 'drink'
}

export const getRecipeId = (recipe: Recipe): string => recipe.idMeal || recipe.idDrink || ''

export const getRecipeTitle = (recipe: Recipe): string => recipe.strMeal || recipe.strDrink || 'Untitled'

export const getRecipeImage = (recipe: Recipe): string =>
  recipe.strMealThumb || recipe.strDrinkThumb || '/local-food-placeholder.svg'

export const getRecipeCategory = (recipe: Recipe): string =>
  recipe.strCategory || (recipe.idDrink ? 'Drink' : 'Meal')

export const toFavoriteRecipe = (recipe: Recipe): FavoriteRecipe | null => {
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

export const fromFavoriteRecipe = (favorite: FavoriteRecipe): Recipe => {
  if (favorite.kind === 'drink') {
    return {
      idDrink: favorite.id,
      strDrink: favorite.title,
      strDrinkThumb: favorite.image,
      strCategory: favorite.category,
    }
  }

  return {
    idMeal: favorite.id,
    strMeal: favorite.title,
    strMealThumb: favorite.image,
    strCategory: favorite.category,
  }
}

