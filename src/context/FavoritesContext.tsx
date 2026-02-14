'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Recipe } from '@/lib/api'
import { FavoriteRecipe, getRecipeId, toFavoriteRecipe } from '@/lib/recipe'

interface FavoritesContextValue {
  favorites: FavoriteRecipe[]
  favoriteIds: Set<string>
  isFavorite: (id: string) => boolean
  toggleFavorite: (recipe: Recipe) => void
  removeFavorite: (id: string) => void
}

const STORAGE_KEY = 'recipe-finder:favorites'

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored) as FavoriteRecipe[]
      if (Array.isArray(parsed)) {
        setFavorites(parsed)
      }
    } catch (error) {
      console.error('Failed to parse favorites:', error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites])

  const isFavorite = (id: string) => favoriteIds.has(id)

  const toggleFavorite = (recipe: Recipe) => {
    const id = getRecipeId(recipe)
    if (!id) return

    setFavorites((current) => {
      if (current.some((item) => item.id === id)) {
        return current.filter((item) => item.id !== id)
      }

      const favorite = toFavoriteRecipe(recipe)
      if (!favorite) return current
      return [favorite, ...current]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((current) => current.filter((item) => item.id !== id))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }

  return context
}

