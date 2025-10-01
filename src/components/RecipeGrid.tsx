import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/api'

interface RecipeGridProps {
  recipes: Recipe[]
}

export const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <Link
          key={recipe.idMeal}
          href={`/recipe/${recipe.idMeal}`}
          className="block rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform bg-gray-800"
        >
          <div className="relative w-full h-48">
            <Image
              src={recipe.strMealThumb || '/fallback.png'}
              alt={recipe.strMeal}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4 text-white">
            <h2 className="text-lg font-bold">{recipe.strMeal}</h2>
            <p className="text-sm text-gray-300">{recipe.strCategory}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
