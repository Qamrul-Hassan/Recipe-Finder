'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Recipe } from '@/lib/api'
import { useFavorites } from '@/context/FavoritesContext'
import { getRecipeCategory, getRecipeId, getRecipeImage, getRecipeTitle } from '@/lib/recipe'

interface RecipeGridProps {
  recipes: Recipe[]
  allowRemove?: boolean
}

const RecipeGrid = ({ recipes, allowRemove = false }: RecipeGridProps) => {
  const reduceMotion = useReducedMotion()
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites()

  return (
    <section aria-label="Recipe results">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {recipes.map((recipe) => {
          const id = getRecipeId(recipe)
          if (!id) return null

          const title = getRecipeTitle(recipe)
          const imgSrc = getRecipeImage(recipe)
          const category = getRecipeCategory(recipe)
          const favorite = isFavorite(id)
          const isPopular = (recipe.strTags || '').toLowerCase().includes('popular')
          const isLocalCatalogCard = imgSrc === '/local-food-placeholder.svg'

          return (
            <motion.li
              key={id}
              className="card recipe-card group relative"
              initial={false}
              whileHover={reduceMotion ? {} : { y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            >
              <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={() => toggleFavorite(recipe)}
                  className={`grid h-10 w-10 place-items-center rounded-full border shadow-md transition ${
                    favorite
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--surface-strong)]'
                      : 'border-[var(--surface-border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill={favorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.8 8.5c0 5.2-8.8 10.9-8.8 10.9S3.2 13.7 3.2 8.5c0-2.6 2-4.6 4.5-4.6 1.6 0 3.1.8 4 2.1.9-1.3 2.4-2.1 4-2.1 2.6 0 4.6 2 4.6 4.6Z" />
                  </svg>
                </button>

                {allowRemove && (
                  <button
                    type="button"
                    aria-label="Remove recipe from this list"
                    onClick={() => removeFavorite(id)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] text-xl font-bold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--accent)]"
                  >
                    ×
                  </button>
                )}
              </div>

              <Link href={`/recipe/${id}`} className="block">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                  {isLocalCatalogCard ? (
                    <div className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-[#eef6db] to-[#dceeba] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                        {recipe.strArea || 'Local'}
                      </p>
                      <p className="mt-1 text-base font-extrabold text-[var(--foreground)]">{title}</p>
                    </div>
                  ) : (
                    <Image
                      src={imgSrc}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
                    />
                  )}
                  {isPopular && (
                    <span className="absolute left-3 top-3 rounded-full border border-[var(--surface-border)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-extrabold text-[var(--foreground)] shadow-sm">
                      Popular
                    </span>
                  )}
                </div>
                <div className="px-1 pb-1 pt-4">
                  <h2 className="text-lg font-extrabold text-[var(--primary)]">{title}</h2>
                  {category && <p className="text-sm font-semibold text-[var(--muted)]">{category}</p>}
                </div>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default RecipeGrid

