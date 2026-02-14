'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Recipe } from '@/lib/api'
import { useFavorites } from '@/context/FavoritesContext'
import { getRecipeId } from '@/lib/recipe'

interface RecipeDetailsProps {
  id: string
}

export default function RecipeDetails({ id }: RecipeDetailsProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true)

      try {
        const [mealResult, drinkResult] = await Promise.allSettled([
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`),
          fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`),
        ])

        const mealData =
          mealResult.status === 'fulfilled' && mealResult.value.ok ? await mealResult.value.json() : null
        const drinkData =
          drinkResult.status === 'fulfilled' && drinkResult.value.ok ? await drinkResult.value.json() : null

        setRecipe(mealData.meals?.[0] || drinkData.drinks?.[0] || null)
      } catch (err) {
        console.error('Error fetching recipe:', err)
        setRecipe(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  const detailMotion = reduceMotion
    ? {}
    : {
        whileHover: { y: -4, scale: 1.01 },
      }

  if (loading) {
    return <p className="p-6 text-center text-[var(--muted)] font-semibold text-lg">Loading recipe...</p>
  }

  if (!recipe) {
    return <p className="p-6 text-center text-[var(--muted)] font-semibold text-lg">Recipe not found.</p>
  }

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ingredient = recipe[`strIngredient${i + 1}`]
    const measure = recipe[`strMeasure${i + 1}`]
    return ingredient ? `${ingredient}${measure ? ` - ${measure}` : ''}` : null
  }).filter(Boolean) as string[]

  const recipeId = getRecipeId(recipe)
  const favorite = recipeId ? isFavorite(recipeId) : false

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="card mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/'))}
          className="btn-3d px-6 py-3 text-sm sm:text-base"
        >
          Back
        </button>

        <button
          onClick={() => toggleFavorite(recipe)}
          className={`rounded-2xl border px-4 py-3 text-sm font-extrabold transition sm:text-base ${
            favorite
              ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--surface-strong)]'
              : 'border-[var(--surface-border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
          }`}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favorite ? 'Saved in Favorites' : 'Add Favorite'}
        </button>
      </section>

      <h1 className="mb-2 text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">{recipe.strMeal || recipe.strDrink}</h1>
      <p className="mb-6 text-base font-semibold text-[var(--muted)] sm:text-lg">
        {recipe.idMeal ? 'Meal' : 'Drink'}
        {recipe.strCategory ? ` | ${recipe.strCategory}` : ''}
        {recipe.strArea ? ` | ${recipe.strArea}` : ''}
      </p>

      <motion.div
        {...detailMotion}
        className="relative mb-6 h-72 w-full overflow-hidden rounded-2xl shadow-lg sm:h-96"
      >
        <Image
          src={recipe.strMealThumb || recipe.strDrinkThumb || '/fallback.png'}
          alt={recipe.strMeal || recipe.strDrink || 'Recipe image'}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1024px"
          className="object-cover"
        />
      </motion.div>

      {ingredients.length > 0 && (
        <section className="card mb-6">
          <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)]">Ingredients</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-2 text-sm font-semibold text-[var(--foreground)]"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.strInstructions && (
        <section className="card mb-6">
          <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)]">Instructions</h2>
          <p className="whitespace-pre-line text-[var(--muted)]">{recipe.strInstructions}</p>
        </section>
      )}

      {recipe.strYoutube && (
        <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="youtube-btn px-6 py-3">
          Watch on YouTube
        </a>
      )}
    </main>
  )
}

