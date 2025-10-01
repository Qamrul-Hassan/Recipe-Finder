import Image from 'next/image'

interface RecipePageProps {
  params: { id: string }
}

export default async function RecipeDetails({ params }: RecipePageProps) {
  // fetch from mealdb
  const resMeal = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${params.id}`
  )
  const mealData = await resMeal.json()

  // fetch from cocktaildb
  const resDrink = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${params.id}`
  )
  const drinkData = await resDrink.json()

  const recipe = mealData.meals?.[0] || drinkData.drinks?.[0]

  if (!recipe) {
    return <p className="p-6 text-red-500">Recipe not found</p>
  }

  // collect ingredients dynamically
  const ingredients = Object.keys(recipe)
    .filter((k) => k.startsWith('strIngredient') && recipe[k])
    .map((k) => recipe[k])

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {recipe.strMeal || recipe.strDrink}
      </h1>

      <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden">
        <Image
          src={recipe.strMealThumb || recipe.strDrinkThumb || '/fallback.png'}
          alt={recipe.strMeal || recipe.strDrink}
          fill
          className="object-cover"
        />
      </div>

      {ingredients.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
          <ul className="list-disc list-inside mb-4">
            {ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </>
      )}

      {recipe.strInstructions && (
        <>
          <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
          <p>{recipe.strInstructions}</p>
        </>
      )}

      {recipe.strYoutube && (
        <a
          href={recipe.strYoutube}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded"
        >
          Watch on YouTube
        </a>
      )}
    </div>
  )
}
