// src/components/RecipeGrid.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/api'

interface RecipeGridProps {
  recipes: Recipe[]
}

const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => {
        const id = recipe.idMeal || recipe.idDrink
        const title = recipe.strMeal || recipe.strDrink || 'Untitled'
        const imgSrc = recipe.strMealThumb || recipe.strDrinkThumb || '/fallback.png'
        const category = recipe.strCategory || (recipe.idDrink ? 'Drink' : 'Meal')

        if (!id) return null // skip if no id

        return (
          <motion.div
            key={id}
            className="card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          >
            <Link href={`/recipe/${id}`}>
              <div className="relative w-full h-48">
                <Image src={imgSrc} alt={title} fill className="object-cover" />
              </div>
              <div className="p-4 text-gray-900 dark:text-gray-100">
                <h2 className="text-lg font-bold">{title}</h2>
                {category && <p className="text-sm text-gray-500">{category}</p>}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default RecipeGrid
