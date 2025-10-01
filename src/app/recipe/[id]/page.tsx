'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as React from 'react'

interface Recipe {
  idMeal?: string
  idDrink?: string
  strMeal?: string
  strDrink?: string
  strMealThumb?: string
  strDrinkThumb?: string
  strInstructions?: string
  strYoutube?: string
  [key: string]: string | undefined
}

export default function RecipeDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)

  // Unwrap params using React.use()
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  useEffect(() => {
    if (!id) return

    const fetchRecipe = async () => {
      setLoading(true)

      const resMeal = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      )
      const mealData = await resMeal.json()

      const resDrink = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      )
      const drinkData = await resDrink.json()

      setRecipe(mealData.meals?.[0] || drinkData.drinks?.[0] || null)
      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  if (loading)
    return <p className="p-6 text-center text-gray-500 font-medium text-lg">Loading recipe...</p>
  if (!recipe)
    return <p className="p-6 text-center text-red-500 font-medium text-lg">Recipe not found</p>

  const ingredients = Object.keys(recipe)
    .filter((k) => k.startsWith('strIngredient') && recipe[k])
    .map((k) => recipe[k])

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-green-50 to-white min-h-screen font-sans">
      {/* Back Button */}
      <button
        onClick={() => window.history.length > 1 ? router.back() : router.push('/')}
        className="mb-6 inline-flex items-center gap-3 text-white font-extrabold text-lg px-11 py-2 rounded-3xl shadow-lg shadow-green-300/50 
                   bg-gradient-to-r from-green-300 via-green-400 to-green-300
                   bg-[length:200%_200%] animate-gradient-shift
                   transition-transform duration-300 transform hover:-translate-y-1"
      >
        <span className="inline-block animate-bounce-left text-3xl">←</span> 
        <span className="text-xl">Back</span>
      </button>

      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        {recipe.strMeal || recipe.strDrink}
      </h1>

      <motion.div whileHover={{ scale: 1.03, y: -5 }} className="relative w-full h-96 mb-6 rounded-xl overflow-hidden shadow-lg">
        <Image
          src={recipe.strMealThumb || recipe.strDrinkThumb || '/fallback.png'}
          alt={recipe.strMeal || recipe.strDrink || 'Recipe Image'}
          fill
          className="object-cover"
        />
      </motion.div>

      {ingredients.length > 0 && (
        <div className="relative rounded-2xl shadow-md p-6 mb-6 transition-transform hover:-translate-y-1 bg-lime-100">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Ingredients:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe.strInstructions && (
        <div className="relative rounded-2xl shadow-md p-6 mb-6 transition-transform hover:-translate-y-1 bg-lime-50">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Instructions:</h2>
          <p className="text-gray-600 whitespace-pre-line">{recipe.strInstructions}</p>
        </div>
      )}

      {recipe.strYoutube && (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="youtube-btn bg-gradient-to-r from-red-200 via-red-600 to-red-100 hover:brightness-110"
        >
          Watch on YouTube
        </a>
      )}
    </div>
  )
}
