'use client'

import { FavoritesProvider } from '@/context/FavoritesContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <FavoritesProvider>
      <div className="app-shell">
        <div className="app-content">
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </FavoritesProvider>
  )
}

