import { create } from 'zustand'

interface FilterState {
  diet: string
  setDiet: (diet: string) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  diet: 'all',
  setDiet: (diet) => set({ diet }),
}))
