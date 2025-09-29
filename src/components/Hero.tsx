'use client'

interface HeroProps {
  query: string
  setQuery: (q: string) => void
}

export const Hero = ({ query, setQuery }: HeroProps) => (
  <section
    className="relative w-full h-96 bg-cover bg-center rounded-xl mb-6"
    style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
  >
    <div className="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Find Your Perfect Recipe</h1>
      <p className="text-lg text-gray-200 mb-6">Search thousands of recipes by ingredient, cuisine, or diet.</p>
      <input
        type="text"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-72 sm:w-96 p-4 rounded-full text-lg shadow-md placeholder-gray-400"
      />
    </div>
  </section>
)
