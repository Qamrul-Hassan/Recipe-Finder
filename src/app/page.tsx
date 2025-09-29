'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/Hero'
import { RecipeGrid } from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'

export default function Home() {
  const [query, setQuery] = useState('chicken')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    fetchRecipes(query).then((data) => {
      setRecipes(data)
      setLoading(false)
    })
  }, [query])

  return (
    <main className="max-w-7xl mx-auto p-4">
      <Hero query={query} setQuery={setQuery} />
      {loading && <p className="text-center text-gray-600 mt-6">Loading recipes...</p>}
      <RecipeGrid recipes={recipes} />
    </main>
  )
}
