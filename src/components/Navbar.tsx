'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useFavorites } from '@/context/FavoritesContext'

const quickTypes = [
  { label: 'Breakfast', query: 'breakfast' },
  { label: 'Pasta', query: 'pasta' },
  { label: 'Seafood', query: 'seafood' },
  { label: 'Drinks', query: 'drinks' },
  { label: 'Coffee', query: 'coffee' },
  { label: 'Tea', query: 'tea' },
  { label: 'Vegan', query: 'vegan' },
  { label: 'Dessert', query: 'dessert' },
  { label: 'Smoothie', query: 'smoothie' },
  { label: 'Cocktail', query: 'cocktail' },
]

const cuisineRegions = [
  { label: 'Asian', region: 'asian' },
  { label: 'Middle Eastern', region: 'middle_eastern' },
  { label: 'Western', region: 'western' },
]

const countrySpotlights = [
  { label: 'American', region: 'American' },
  { label: 'British', region: 'British' },
  { label: 'Chinese', region: 'Chinese' },
  { label: 'French', region: 'French' },
  { label: 'Greek', region: 'Greek' },
  { label: 'Indian', region: 'Indian' },
  { label: 'Italian', region: 'Italian' },
  { label: 'Japanese', region: 'Japanese' },
  { label: 'Korean', region: 'Korean' },
  { label: 'Lebanese', region: 'Lebanese' },
  { label: 'Mexican', region: 'Mexican' },
  { label: 'Moroccan', region: 'Moroccan' },
  { label: 'Pakistani', region: 'Pakistani' },
  { label: 'Portuguese', region: 'Portuguese' },
  { label: 'Spanish', region: 'Spanish' },
  { label: 'Thai', region: 'Thai' },
  { label: 'Turkish', region: 'Turkish' },
  { label: 'Vietnamese', region: 'Vietnamese' },
]

type PanelKey = 'quick' | 'regions' | 'countries'

function NavbarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { favorites } = useFavorites()
  const [activePanel, setActivePanel] = useState<PanelKey>('quick')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isHome = pathname === '/'
  const isFavorites = pathname === '/favorites'
  const selectedRegions = useMemo(
    () =>
      searchParams
        .getAll('region')
        .flatMap((value) => value.split(','))
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    [searchParams],
  )
  const selectedRegionsKey = selectedRegions.join('|')
  const queryValue = searchParams.get('q')?.trim() || ''
  const selectedQuery = queryValue.toLowerCase()

  useEffect(() => {
    if (selectedRegions.length > 0) {
      const isCountrySelection = selectedRegions.some((region) =>
        countrySpotlights.some((country) => country.region.toLowerCase() === region),
      )
      const isGlobalRegionSelection = selectedRegions.some((region) =>
        cuisineRegions.some((group) => group.region.toLowerCase() === region),
      )

      if (isCountrySelection) {
        setActivePanel('countries')
        return
      }

      if (isGlobalRegionSelection) {
        setActivePanel('regions')
        return
      }

      setActivePanel('regions')
      return
    }

    if (queryValue) {
      setActivePanel('quick')
      return
    }

    if (!queryValue) {
      setActivePanel('quick')
    }
  }, [selectedRegions, selectedRegionsKey, queryValue])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="glass-panel shell-gradient navbar-premium mx-auto w-full max-w-7xl rounded-3xl p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="navbar-logo-mark" aria-hidden="true">
              <svg className="navbar-logo-svg" viewBox="0 0 64 64" focusable="false">
                <defs>
                  <linearGradient id="rfBase" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#23341D" />
                    <stop offset="48%" stopColor="#4A5650" />
                    <stop offset="100%" stopColor="#65B030" />
                  </linearGradient>
                  <linearGradient id="rfEdge" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#DCEEBA" />
                    <stop offset="100%" stopColor="#75E024" />
                  </linearGradient>
                  <linearGradient id="rfGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F3F9E4" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#DCEEBA" stopOpacity="0.82" />
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="56" height="56" rx="17" fill="url(#rfBase)" />
                <rect x="8" y="8" width="48" height="48" rx="14" fill="none" stroke="url(#rfGlow)" strokeOpacity="0.48" />
                <circle cx="32" cy="32" r="15.5" fill="none" stroke="url(#rfEdge)" strokeWidth="1.5" strokeOpacity="0.9" />
                <g fill="#F3F9E4">
                  <path d="M23 23.2h7.7c3.8 0 6.2 2.1 6.2 5.3 0 2.2-1.2 3.8-3.3 4.7l4 6.8h-4.6l-3.4-5.9h-2.5V40H23V23.2Zm4.1 3.4v4.2h3.1c1.6 0 2.5-.8 2.5-2.1 0-1.3-.9-2.1-2.5-2.1h-3.1Z" />
                  <path d="M26.2 43.5H38v-3.2h-8.1v-3h6.8v-3.1h-10.5z" fill="#75E024" />
                </g>
                <g fill="none" stroke="#DCEEBA" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 19.8v6.2" />
                  <path d="M16.8 19.8v6.2" />
                  <path d="M19.6 19.8v6.2" />
                  <path d="M16.8 25.8v18.8" />
                </g>
                <g fill="none" stroke="#F3F9E4" strokeWidth="1.5" strokeLinecap="round">
                  <ellipse cx="48.4" cy="21.5" rx="2.8" ry="3.7" />
                  <path d="M48.4 25.1v19.2" />
                </g>
                <path d="M11.5 50h10.5" stroke="#75E024" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.86" />
                <path d="M42.5 50h10" stroke="url(#rfEdge)" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.86" />
                <rect x="4" y="4" width="56" height="56" rx="17" fill="none" stroke="url(#rfEdge)" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <Link href="/" className="navbar-wordmark block text-xl font-extrabold tracking-tight sm:text-3xl">
                Recipe Finder
              </Link>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] sm:block">
                Global recipes and crafted drinks
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className={`navbar-pill ${
                  isHome
                    ? 'bg-[var(--primary)] text-[var(--surface-strong)]'
                    : 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                }`}
              >
                Explore
              </Link>
              <Link
                href="/favorites"
                className={`navbar-pill ${
                  isFavorites
                    ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                    : 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--accent)]'
                }`}
              >
                Favorites ({favorites.length})
              </Link>
            </nav>

            <button
              type="button"
              className="premium-icon-pill sm:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navbar-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>

            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} items-center gap-2 sm:flex`} aria-label="Social links">
              <a href="https://github.com/Qamrul-Hassan" target="_blank" rel="noopener noreferrer" className="premium-icon-pill" aria-label="GitHub" title="GitHub">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.2.8-.6v-2c-3.4.8-4.2-1.4-4.2-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1 2.1.9 2.6 1.8.6 0 1.1 0 1.5-.2.1-.7.4-1.3.8-1.6-2.7-.3-5.6-1.4-5.6-6.1 0-1.4.5-2.6 1.2-3.5 0-.3-.5-1.5.1-3.1 0 0 1-.3 3.6 1.2a12 12 0 0 1 6.5 0c2.5-1.5 3.6-1.2 3.6-1.2.6 1.6.1 2.8.1 3.1.8.9 1.2 2.1 1.2 3.5 0 4.8-2.9 5.8-5.6 6.1.5.4.9 1.2.9 2.4v3.5c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/md-qamrul-hassan-a44b3835b/" target="_blank" rel="noopener noreferrer" className="premium-icon-pill" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M4.9 3.5A2.4 2.4 0 1 0 5 8.3a2.4 2.4 0 0 0-.1-4.8ZM2.8 9.8h4.3V21H2.8V9.8Zm7 0H14v1.5h.1c.6-1.1 2-1.8 4-1.8 4.2 0 5 2.7 5 6.2V21h-4.3v-4.7c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5V21H11V9.8Z" /></svg>
              </a>
              <a href="https://portfolio-next16.vercel.app/" target="_blank" rel="noopener noreferrer" className="premium-icon-pill" aria-label="Portfolio" title="Portfolio">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 7h18v12H3z" /><path d="M8 7V5h8v2" /></svg>
              </a>
            </div>
          </div>
        </div>

        <section
          id="mobile-navbar-menu"
          className={`${mobileMenuOpen ? 'block' : 'hidden'} filter-workspace mt-4 sm:block`}
          aria-label="Discover filters"
        >
          <div className="filter-tabs" role="tablist" aria-label="Filter groups">
            <button
              role="tab"
              type="button"
              aria-selected={activePanel === 'quick'}
              className={`filter-tab ${activePanel === 'quick' ? 'active' : ''}`}
              onClick={() => setActivePanel('quick')}
            >
              Quick Finds
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activePanel === 'regions'}
              className={`filter-tab ${activePanel === 'regions' ? 'active' : ''}`}
              onClick={() => setActivePanel('regions')}
            >
              Global Regions
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={activePanel === 'countries'}
              className={`filter-tab ${activePanel === 'countries' ? 'active' : ''}`}
              onClick={() => setActivePanel('countries')}
            >
              Country Spotlights
            </button>
          </div>

          <div className="filter-panel" role="tabpanel">
            {activePanel === 'quick' && (
              <ul className="flex min-w-max items-center gap-2 pb-1 sm:gap-3">
                {quickTypes.map((type) => (
                  <li key={type.query}>
                    {(() => {
                      const isActive = selectedQuery === type.query.toLowerCase()
                      return (
                        <Link
                          href={`/?q=${encodeURIComponent(type.query)}`}
                          className={`navbar-chip inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
                            isActive
                              ? 'country-spotlight-chip-active'
                              : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)]'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {type.label}
                        </Link>
                      )
                    })()}
                  </li>
                ))}
              </ul>
            )}

            {activePanel === 'regions' && (
              <ul className="flex min-w-max items-center gap-2 pb-1 sm:gap-3">
                {cuisineRegions.map((item) => (
                  <li key={item.region}>
                    {(() => {
                      const isActive = selectedRegions.includes(item.region.toLowerCase())
                      return (
                        <Link
                          href={`/?region=${encodeURIComponent(item.region)}`}
                          className={`navbar-chip region-chip inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
                            isActive
                              ? 'country-spotlight-chip-active'
                              : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)]'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      )
                    })()}
                  </li>
                ))}
              </ul>
            )}

            {activePanel === 'countries' && (
              <ul className="flex flex-wrap items-center gap-2 pb-1 sm:gap-3">
                {countrySpotlights.map((item) => (
                  <li key={item.region}>
                    {(() => {
                      const isActive = selectedRegions.includes(item.region.toLowerCase())
                      return (
                        <Link
                          href={`/?region=${encodeURIComponent(item.region)}`}
                          className={`navbar-chip country-spotlight-chip inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${
                            isActive
                              ? 'country-spotlight-chip-active'
                              : 'border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)]'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      )
                    })()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </header>
  )
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="glass-panel shell-gradient navbar-premium mx-auto w-full max-w-7xl rounded-3xl p-4 shadow-xl sm:p-5">
        <Link href="/" className="navbar-wordmark block text-xl font-extrabold tracking-tight sm:text-3xl">
          Recipe Finder
        </Link>
      </div>
    </header>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarContent />
    </Suspense>
  )
}
