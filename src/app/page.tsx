'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Hero } from '@/components/Hero'
import RecipeGrid from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'

function HomeContent() {
  const searchParams = useSearchParams()
  const selectedQuery = searchParams.get('q')?.trim() || ''
  const selectedRegions = useMemo(
    () =>
      searchParams
        .getAll('region')
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .filter(Boolean),
    [searchParams],
  )
  const selectedRegionsKey = selectedRegions.join('|')
  const hasSelectedRegions = selectedRegions.length > 0
  const [query, setQuery] = useState<string>('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (selectedQuery) {
      setQuery(selectedQuery)
      return
    }
    setQuery('')
  }, [selectedQuery])

  useEffect(() => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    let isStale = false
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes([trimmedQuery])
        if (!isStale) setRecipes(data)
      } catch (err) {
        console.error('Error fetching recipes:', err)
        if (!isStale) setRecipes([])
      } finally {
        if (!isStale) setLoading(false)
      }
    }, 350)

    return () => {
      isStale = true
      clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    if (selectedQuery || !hasSelectedRegions) return

    let isStale = false
    const fetchByRegion = async () => {
      setLoading(true)
      try {
        const data = await fetchRecipes([''], { regions: selectedRegions })
        if (!isStale) setRecipes(data)
      } catch (err) {
        console.error('Error fetching regional recipes:', err)
        if (!isStale) setRecipes([])
      } finally {
        if (!isStale) setLoading(false)
      }
    }

    fetchByRegion()

    return () => {
      isStale = true
    }
  }, [selectedQuery, hasSelectedRegions, selectedRegions, selectedRegionsKey])

  useEffect(() => {
    if (selectedQuery || hasSelectedRegions) return

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
  }, [selectedQuery, hasSelectedRegions])

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <Hero query={query} setQuery={setQuery} />

      {loading && recipes.length === 0 && (
        <p className="text-center text-[var(--muted)] mt-6 font-semibold">Loading recipes...</p>
      )}

      {!loading && recipes.length === 0 && (
        <p className="text-center text-[var(--muted)] mt-6 font-semibold">No recipes found.</p>
      )}

      <RecipeGrid recipes={recipes} />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <p className="text-center text-[var(--muted)] mt-6 font-semibold">Loading recipes...</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
