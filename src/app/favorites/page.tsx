'use client'

import Link from 'next/link'
import RecipeGrid from '@/components/RecipeGrid'
import { useFavorites } from '@/context/FavoritesContext'
import { fromFavoriteRecipe } from '@/lib/recipe'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const recipes = favorites.map(fromFavoriteRecipe)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <section className="card mb-6">
        <h1 className="text-3xl font-extrabold text-[var(--foreground)] sm:text-4xl">Your Favorite Recipes</h1>
        <p className="mt-2 text-base font-medium text-[var(--muted)]">
          Save your best meals and drinks here. Remove any card with the remove icon.
        </p>
      </section>

      {recipes.length === 0 ? (
        <section className="card text-center">
          <p className="text-lg font-semibold text-[var(--muted)]">No favorites yet.</p>
          <Link href="/" className="btn-3d mt-4 inline-block px-6 py-3">
            Explore Recipes
          </Link>
        </section>
      ) : (
        <RecipeGrid recipes={recipes} allowRemove />
      )}
    </main>
  )
}

