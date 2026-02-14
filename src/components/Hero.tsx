'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface HeroProps {
  query: string
  setQuery: (q: string) => void
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const placeholders = [
  'margarita',
  'arrabiata',
  'chicken',
  'salad',
  'mojito',
  'pasta',
  'pancakes',
  'bloody mary',
]

const banners = ['/banner-3.png', '/banner-2.png', '/banner-1.jpg', '/Rec-1.jpg']

export const Hero = ({ query, setQuery, onKeyPress }: HeroProps) => {
  const [placeholder, setPlaceholder] = useState('')
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * placeholders.length)
    setPlaceholder(`Try '${placeholders[randomIndex]}'...`)
  }, [])

  return (
    <section
      className="hero-section relative mb-8 min-h-[23rem] overflow-hidden rounded-3xl bg-[rgba(18,28,15,0.55)] sm:min-h-[27rem]"
      aria-labelledby="hero-heading"
    >
      <Image
        src={banners[bannerIndex]}
        alt="Recipe banner"
        fill
        priority
        sizes="(max-width: 1280px) 100vw, 1280px"
        className="object-cover object-[center_38%]"
        onError={() => setBannerIndex((current) => Math.min(current + 1, banners.length - 1))}
      />

      <div className="absolute inset-0 hero-overlay"></div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-10 text-center sm:px-8">
        <div className="hero-content-shell">
          <p className="hero-kicker mb-3">Fresh Daily Picks</p>
          <h1
            id="hero-heading"
            className="hero-title mb-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Find Your Favorite Recipes
          </h1>
          <p
            className="mb-8 max-w-2xl text-base font-semibold text-[var(--hero-subtext)] drop-shadow-[0_3px_12px_rgba(0,0,0,0.56)] sm:text-lg"
            style={{ color: '#f3f9e4' }}
          >
            Search meals and cocktails in seconds with a brighter, bolder cooking experience.
          </p>
        </div>

        <form
          className="hero-search-row flex w-full max-w-3xl flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            setQuery(query.trim())
          }}
          role="search"
          aria-label="Search recipes"
        >
          <label htmlFor="recipe-search" className="sr-only">
            Search recipes
          </label>
          <input
            id="recipe-search"
            type="text"
            placeholder={placeholder || 'Search for recipes...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyPress}
            className="hero-search-input w-full rounded-2xl border px-5 py-4 text-center text-base shadow-lg transition-all duration-300 sm:text-lg"
          />
        </form>
      </div>
    </section>
  )
}
