import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/lib/api';

interface RecipeGridProps {
  recipes: Recipe[];
}

export const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <motion.div
          key={recipe.idMeal}
          className="card"
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          <Link href={`/recipe/${recipe.idMeal}`}>
            <div className="relative w-full h-48">
              <Image
                src={recipe.strMealThumb || '/fallback.png'}
                alt={recipe.strMeal}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-gray-900 dark:text-gray-100">
              <h2 className="text-lg font-bold">{recipe.strMeal}</h2>
              <p className="text-sm text-gray-500">{recipe.strCategory}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
