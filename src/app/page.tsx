'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { RecipeGrid } from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'

export default function Home() {
  const [query, setQuery] = useState<string>('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch recipes whenever the query changes
  useEffect(() => {
    if (!query.trim()) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes([query])
        setRecipes(data)
      } catch (err) {
        console.error('Error fetching recipes:', err)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query])

  // Fetch popular recipes on initial load
  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes([''])
        setRecipes(data)
      } catch (err) {
        console.error('Error fetching popular recipes:', err)
        setRecipes([])
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [])

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Hero query={query} setQuery={setQuery} />

      {loading && (
        <p className="text-center text-gray-600 mt-6 font-medium">Loading recipes...</p>
      )}

      {!loading && recipes.length === 0 && (
        <p className="text-center text-gray-600 mt-6 font-medium">No recipes found.</p>
      )}

      <RecipeGrid recipes={recipes} />
    </main>
  )
}
