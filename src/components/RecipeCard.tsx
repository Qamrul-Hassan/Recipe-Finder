'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Recipe } from '@/lib/api'

interface Props {
  recipe: Recipe
}

const RecipeCard = ({ recipe }: Props) => {
  const [showModal, setShowModal] = useState(false)

  const getIngredients = () => {
    const ingredients: string[] = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe]
      const measure = recipe[`strMeasure${i}` as keyof Recipe]
      if (ingredient) {
        ingredients.push(`${measure || ''} ${ingredient}`.trim())
      }
    }
    return ingredients
  }

  const title = recipe.strMeal || recipe.strDrink || 'Untitled'
  const imgSrc = recipe.strMealThumb || recipe.strDrinkThumb || '/fallback.png'
  const instructions = recipe.strInstructions || ''

  return (
    <>
      <div
        className="card p-4 flex flex-col cursor-pointer hover:scale-105 transition-transform shadow-lg rounded-xl"
        onClick={() => setShowModal(true)}
      >
        <div className="relative w-full h-48 mb-4">
          <Image
            src={imgSrc}
            alt={title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              ×
            </button>
            <Image
              src={imgSrc}
              alt={title}
              width={600}
              height={400}
              className="w-full h-64 object-cover rounded-t-xl"
            />
            <div className="p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="mb-4 text-gray-300">{instructions}</p>

              <h3 className="font-semibold mb-2">Ingredients:</h3>
              <ul className="mb-4 list-disc list-inside text-gray-200">
                {getIngredients().map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              {recipe.strYoutube && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
                >
                  Watch on YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RecipeCard
