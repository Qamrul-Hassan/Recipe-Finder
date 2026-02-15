'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Hero } from '@/components/Hero'
import RecipeGrid from '@/components/RecipeGrid'
import { fetchRecipes, Recipe } from '@/lib/api'
import { getMostlyCheckedRecipes } from '@/lib/insights'

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
  const [mostlyCheckedRecipes, setMostlyCheckedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (selectedQuery) {
      setQuery(selectedQuery)
      return
    }
    setQuery('')
  }, [selectedQuery])

  useEffect(() => {
    let isStale = false

    const loadMostlyChecked = async () => {
      const data = await getMostlyCheckedRecipes(8)
      if (!isStale) setMostlyCheckedRecipes(data)
    }

    loadMostlyChecked()

    return () => {
      isStale = true
    }
  }, [])

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

      {mostlyCheckedRecipes.length > 0 && (
        <section className="mb-8">
          <div className="card mb-4">
            <h2 className="text-2xl font-extrabold text-[var(--foreground)] sm:text-3xl">Mostly Checked Recipes</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--muted)] sm:text-base">
              Based on recipes opened most often by all users.
            </p>
          </div>
          <RecipeGrid recipes={mostlyCheckedRecipes} />
        </section>
      )}

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
