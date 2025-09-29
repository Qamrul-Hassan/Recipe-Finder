'use client'

interface Props {
  ingredients: string[]
  setIngredients: (arr: string[]) => void
}

export const IngredientChips = ({ ingredients, setIngredients }: Props) => {
  const remove = (item: string) => setIngredients(ingredients.filter((i) => i !== item))

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {ingredients.map((ing) => (
        <span
          key={ing}
          className="bg-primary text-white px-3 py-1 rounded-full cursor-pointer hover:opacity-80"
          onClick={() => remove(ing)}
        >
          {ing} ×
        </span>
      ))}
    </div>
  )
}
