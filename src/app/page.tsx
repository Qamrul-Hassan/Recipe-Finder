'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { RecipeGrid } from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'

export default function Home() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch recipes when query changes
  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) return

      setLoading(true)
      const data = await fetchRecipes([query]) // pass as array to fetchRecipes
      setRecipes(data)
      setLoading(false)
    }

    fetchData()
  }, [query])

  // Fetch popular recipes on load
  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      const data = await fetchRecipes(['']) // empty query = default popular
      setRecipes(data)
      setLoading(false)
    }

    fetchPopular()
  }, [])

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Hero query={query} setQuery={setQuery} />
      {loading && <p className="text-center text-gray-600 mt-6">Loading recipes...</p>}
      {!loading && recipes.length === 0 && (
        <p className="text-center text-gray-600 mt-6">No recipes found.</p>
      )}
      <RecipeGrid recipes={recipes} />
    </main>
  )
}