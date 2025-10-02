'use client'

import { useState, useEffect } from 'react'

interface HeroProps {
  query: string
  setQuery: (q: string) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

// Move placeholders outside the component to avoid ESLint warnings
const placeholders = [
  "margarita",
  "arrabiata",
  "chicken",
  "salad",
  "mojito",
  "pasta",
  "pancakes",
  "bloody mary",
]

export const Hero = ({ query, setQuery, onKeyPress }: HeroProps) => {
  const [placeholder, setPlaceholder] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length)
    setPlaceholder(`Try '${placeholders[randomIndex]}'...`)
  }, []) // no dependency warning

  return (
    <section
      className="relative w-full h-96 bg-cover bg-center rounded-xl mb-6"
      style={{ backgroundImage: `url('/Rec-1.jpg')` }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-lime-200 mb-4">
          Find Your Favorite Recipes
        </h1>
        <p className="text-lg text-lime-50 mb-6 max-w-xl">
          Search meals 🍽 or cocktails 🍹 in seconds.
        </p>

        <input
          type="text"
          placeholder={placeholder || "Search for recipes..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyPress}
          className="w-72 sm:w-96 p-4 rounded-full text-lg shadow-2xl 
                     bg-gray-900/80 backdrop-blur-sm border border-gray-600 
                     placeholder-gray-400 text-white text-center 
                     focus:bg-gray-800 focus:border-green-400 
                     focus:ring-2 focus:ring-green-400/50 
                     transition-all duration-300"
        />
      </div>
    </section>
  )
}
