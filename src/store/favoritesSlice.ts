import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Recipe {
  id: string
  title: string
  image: string
}

interface FavoritesState {
  items: Recipe[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Recipe>) => {
      state.items.push(action.payload)
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(r => r.id !== action.payload)
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
