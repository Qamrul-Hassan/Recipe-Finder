# Recipe Finder

Recipe Finder is a modern Next.js app for discovering meals and drinks from public recipe APIs.
It includes global cuisine filters, favorites, detailed recipe pages, and a responsive premium UI.

## Features
- Search meals and drinks by keyword
- Browse quick categories (Breakfast, Pasta, Seafood, Drinks, Vegan, Dessert, Smoothie, Cocktail)
- Explore by global regions and country spotlights
- Save and manage favorites on a dedicated `/favorites` page
- View recipe details with ingredients, instructions, and media links (when available)
- Fully responsive layout for mobile, tablet, and desktop
- Lightweight animations with accessibility-friendly behavior

## Tech Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- ESLint

## Data Sources
- [TheMealDB](https://www.themealdb.com/)
- [TheCocktailDB](https://www.thecocktaildb.com/)

## Getting Started
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open the app:
`http://localhost:3000`

## Scripts
- `npm run dev` - Run local development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables
The project currently works with public API endpoints and does not require secrets.

If you want to keep local placeholders, create `.env.local` with:
```bash
NEXT_PUBLIC_MEALDB_API_KEY=1
NEXT_PUBLIC_COCKTAILDB_API_KEY=1
```

## Deployment
Recommended platform: Vercel.

1. Push repository to GitHub
2. Import the repo in Vercel
3. Deploy

## Project Structure
```text
src/
  app/
    page.tsx
    favorites/page.tsx
    recipe/[id]/page.tsx
  components/
  context/
  lib/
  styles/
public/
```
