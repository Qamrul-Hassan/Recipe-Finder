'use client'

interface HeroProps {
  query: string
  setQuery: (q: string) => void
}

export const Hero = ({ query, setQuery }: HeroProps) => {
  return (
    <section
      className="relative w-full h-96 bg-cover bg-center rounded-xl mb-6"
      style={{ backgroundImage: `url('/Rec-1.jpg')` }} // Directly use local image
    >
      <div className="absolute inset-0 bg-black/50 rounded-xl"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          All Your Food. One Place.
        </h1>
        <p className="text-lg text-gray-200 mb-6">
          Save, plan, and explore recipes in seconds.
        </p>
        <input
          type="text"
          placeholder="Try 'chicken', 'pasta', or 'salad'..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
         className="w-72 sm:w-96 p-4 rounded-full text-lg shadow-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-600 placeholder-gray-400 text-white text-center focus:bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
        />
      </div>
    </section>
  )
}