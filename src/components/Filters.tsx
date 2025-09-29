'use client'

interface Filter {
  label: string
  value: string
}

interface FiltersProps {
  filters: Filter[]
  selected: string
  setSelected: (val: string) => void
}

export const Filters = ({ filters, selected, setSelected }: FiltersProps) => (
  <div className="flex flex-wrap gap-3 mb-6 justify-center">
    {filters.map((filter) => (
      <button
        key={filter.value}
        className={`px-4 py-2 rounded-full border-2 ${
          selected === filter.value
            ? 'bg-green-500 text-white border-green-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
        } transition-all`}
        onClick={() => setSelected(filter.value)}
      >
        {filter.label}
      </button>
    ))}
  </div>
)
