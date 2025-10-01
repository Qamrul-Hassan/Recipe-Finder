'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/Hero' // Use named import with curly braces
import { RecipeGrid } from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'

export default function Home() {
  const [query, setQuery] = useState('') // Empty initial state - search bar will be blank
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch recipes when query changes (but only if query is not empty)
  useEffect(() => {
    if (!query.trim()) return
    
    setLoading(true)
    fetchRecipes(query).then((data) => {
      setRecipes(data)
      setLoading(false)
    })
  }, [query])

  // Optional: Fetch popular recipes on initial load so the page isn't empty
  useEffect(() => {
    fetchRecipes('popular').then((data) => {
      setRecipes(data)
    })
  }, [])

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Hero query={query} setQuery={setQuery} />
      {loading && <p className="text-center text-gray-600 mt-6">Loading recipes...</p>}
      <RecipeGrid recipes={recipes} />
    </main>
  )
}