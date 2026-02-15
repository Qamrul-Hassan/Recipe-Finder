import type { Recipe } from '@/lib/api'

interface LocalDish {
  name: string
  category: string
  popular?: boolean
}

interface LocalCountry {
  area: string
  aliases?: string[]
  dishes: LocalDish[]
}

const PLACEHOLDER_IMAGE = '/local-food-placeholder.svg'

const LOCAL_COUNTRIES: Record<string, LocalCountry> = {
  american: {
    area: 'American',
    dishes: [
      { name: 'Cheeseburger', category: 'Main', popular: true },
      { name: 'BBQ Ribs', category: 'Main', popular: true },
      { name: 'Mac and Cheese', category: 'Pasta' },
      { name: 'Fried Chicken', category: 'Main' },
    ],
  },
  bangladeshi: {
    area: 'Bangladeshi',
    aliases: ['bangladesh'],
    dishes: [
      { name: 'Bangladeshi Pulao', category: 'Rice', popular: true },
      { name: 'Bangladeshi Biryani', category: 'Rice', popular: true },
      { name: 'Kacchi Biryani', category: 'Rice', popular: true },
      { name: 'Fuchka', category: 'Street Food', popular: true },
      { name: 'Chotpoti', category: 'Street Food', popular: true },
      { name: 'Bhuna Khichuri', category: 'Rice' },
    ],
  },
  brazilian: {
    area: 'Brazilian',
    dishes: [
      { name: 'Feijoada', category: 'Stew', popular: true },
      { name: 'Moqueca', category: 'Seafood', popular: true },
      { name: 'Pao de Queijo', category: 'Snack' },
      { name: 'Picanha', category: 'Grill' },
    ],
  },
  british: {
    area: 'British',
    dishes: [
      { name: 'Fish and Chips', category: 'Seafood', popular: true },
      { name: 'Shepherds Pie', category: 'Main', popular: true },
      { name: 'Full English Breakfast', category: 'Breakfast' },
      { name: 'Sticky Toffee Pudding', category: 'Dessert' },
    ],
  },
  chinese: {
    area: 'Chinese',
    dishes: [
      { name: 'Kung Pao Chicken', category: 'Chicken', popular: true },
      { name: 'Sweet and Sour Pork', category: 'Main', popular: true },
      { name: 'Mapo Tofu', category: 'Vegetarian' },
      { name: 'Dumplings', category: 'Snack' },
    ],
  },
  french: {
    area: 'French',
    dishes: [
      { name: 'Beef Bourguignon', category: 'Main', popular: true },
      { name: 'Ratatouille', category: 'Vegetarian', popular: true },
      { name: 'Quiche Lorraine', category: 'Main' },
      { name: 'Creme Brulee', category: 'Dessert' },
    ],
  },
  greek: {
    area: 'Greek',
    dishes: [
      { name: 'Moussaka', category: 'Main', popular: true },
      { name: 'Souvlaki', category: 'Grill', popular: true },
      { name: 'Greek Salad', category: 'Salad' },
      { name: 'Spanakopita', category: 'Snack' },
    ],
  },
  indian: {
    area: 'Indian',
    dishes: [
      { name: 'Chicken Biryani', category: 'Rice', popular: true },
      { name: 'Butter Chicken', category: 'Chicken', popular: true },
      { name: 'Masala Dosa', category: 'Breakfast' },
      { name: 'Paneer Tikka', category: 'Vegetarian' },
    ],
  },
  italian: {
    area: 'Italian',
    dishes: [
      { name: 'Margherita Pizza', category: 'Main', popular: true },
      { name: 'Spaghetti Carbonara', category: 'Pasta', popular: true },
      { name: 'Risotto', category: 'Rice' },
      { name: 'Tiramisu', category: 'Dessert' },
    ],
  },
  japanese: {
    area: 'Japanese',
    dishes: [
      { name: 'Sushi', category: 'Seafood', popular: true },
      { name: 'Ramen', category: 'Noodles', popular: true },
      { name: 'Chicken Teriyaki', category: 'Chicken' },
      { name: 'Tempura', category: 'Seafood' },
    ],
  },
  korean: {
    area: 'Korean',
    dishes: [
      { name: 'Bibimbap', category: 'Rice', popular: true },
      { name: 'Bulgogi', category: 'Beef', popular: true },
      { name: 'Kimchi Jjigae', category: 'Stew' },
      { name: 'Tteokbokki', category: 'Street Food' },
    ],
  },
  lebanese: {
    area: 'Lebanese',
    dishes: [
      { name: 'Chicken Shawarma', category: 'Main', popular: true },
      { name: 'Hummus Plate', category: 'Dip', popular: true },
      { name: 'Falafel Wrap', category: 'Street Food' },
      { name: 'Tabbouleh', category: 'Salad' },
    ],
  },
  mexican: {
    area: 'Mexican',
    dishes: [
      { name: 'Tacos al Pastor', category: 'Street Food', popular: true },
      { name: 'Chicken Enchiladas', category: 'Main', popular: true },
      { name: 'Quesadilla', category: 'Snack' },
      { name: 'Guacamole', category: 'Dip' },
    ],
  },
  moroccan: {
    area: 'Moroccan',
    dishes: [
      { name: 'Chicken Tagine', category: 'Stew', popular: true },
      { name: 'Couscous Royal', category: 'Main', popular: true },
      { name: 'Harira Soup', category: 'Soup' },
      { name: 'Pastilla', category: 'Pastry' },
    ],
  },
  pakistani: {
    area: 'Pakistani',
    aliases: ['pakistan'],
    dishes: [
      { name: 'Nihari', category: 'Beef', popular: true },
      { name: 'Chicken Karahi', category: 'Chicken', popular: true },
      { name: 'Sindhi Biryani', category: 'Rice', popular: true },
      { name: 'Chapli Kebab', category: 'Kebab' },
    ],
  },
  portuguese: {
    area: 'Portuguese',
    dishes: [
      { name: 'Bacalhau a Bras', category: 'Seafood', popular: true },
      { name: 'Caldo Verde', category: 'Soup', popular: true },
      { name: 'Piri Piri Chicken', category: 'Chicken' },
      { name: 'Pastel de Nata', category: 'Dessert' },
    ],
  },
  spanish: {
    area: 'Spanish',
    dishes: [
      { name: 'Paella', category: 'Seafood', popular: true },
      { name: 'Tortilla Espanola', category: 'Egg', popular: true },
      { name: 'Patatas Bravas', category: 'Snack' },
      { name: 'Gazpacho', category: 'Soup' },
    ],
  },
  thai: {
    area: 'Thai',
    dishes: [
      { name: 'Pad Thai', category: 'Noodles', popular: true },
      { name: 'Tom Yum Soup', category: 'Soup', popular: true },
      { name: 'Green Curry', category: 'Curry' },
      { name: 'Som Tum', category: 'Salad' },
    ],
  },
  turkish: {
    area: 'Turkish',
    dishes: [
      { name: 'Doner Kebab', category: 'Kebab', popular: true },
      { name: 'Lahmacun', category: 'Flatbread', popular: true },
      { name: 'Menemen', category: 'Breakfast' },
      { name: 'Baklava', category: 'Dessert' },
    ],
  },
  vietnamese: {
    area: 'Vietnamese',
    dishes: [
      { name: 'Pho', category: 'Soup', popular: true },
      { name: 'Banh Mi', category: 'Sandwich', popular: true },
      { name: 'Goi Cuon', category: 'Rolls' },
      { name: 'Bun Cha', category: 'Noodles' },
    ],
  },
}

const normalizeKey = (value: string): string => value.trim().toLowerCase()

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const ALIAS_TO_KEY: Record<string, string> = (() => {
  const map: Record<string, string> = {}
  Object.entries(LOCAL_COUNTRIES).forEach(([key, country]) => {
    map[key] = key
    ;(country.aliases || []).forEach((alias) => {
      map[normalizeKey(alias)] = key
    })
  })
  return map
})()

const resolveCountryKey = (country: string): string | null => {
  const normalized = normalizeKey(country)
  return ALIAS_TO_KEY[normalized] || null
}

const toRecipe = (countryKey: string, country: LocalCountry, dish: LocalDish, index: number): Recipe => ({
  idMeal: `local-${countryKey}-${index + 1}-${slugify(dish.name)}`,
  strMeal: dish.name,
  strCategory: dish.category,
  strArea: country.area,
  strMealThumb: PLACEHOLDER_IMAGE,
  strInstructions: `Traditional ${country.area} dish. This local catalog entry is shown when external recipe data is unavailable.`,
  strIngredient1: 'Main ingredients vary by recipe',
  strMeasure1: '',
  strIngredient2: 'Cook with regional spices',
  strMeasure2: '',
  strTags: dish.popular ? 'Popular' : '',
})

const BUILT_RECIPES_BY_COUNTRY: Record<string, Recipe[]> = Object.fromEntries(
  Object.entries(LOCAL_COUNTRIES).map(([key, country]) => [
    key,
    country.dishes.map((dish, index) => toRecipe(key, country, dish, index)),
  ]),
)

const ALL_LOCAL_RECIPES: Recipe[] = Object.values(BUILT_RECIPES_BY_COUNTRY).flat()

export const isLocalCountrySupported = (country: string): boolean => resolveCountryKey(country) !== null

export const getLocalRecipesForCountries = (countries: string[]): Recipe[] => {
  const seen = new Set<string>()

  const merged = countries.flatMap((country) => {
    const key = resolveCountryKey(country)
    if (!key) return []
    return BUILT_RECIPES_BY_COUNTRY[key] || []
  })

  return merged.filter((recipe) => {
    const id = recipe.idMeal || recipe.idDrink
    if (!id || seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export const getLocalRecipeById = (id: string): Recipe | null => {
  const match = ALL_LOCAL_RECIPES.find((recipe) => recipe.idMeal === id || recipe.idDrink === id)
  return match || null
}
