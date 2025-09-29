'use client'

import Image from 'next/image'

interface Props {
  params: { id: string }
}

interface RecipeDetailsType {
  title: string
  image: string
  extendedIngredients: { id: number; original: string }[]
  instructions: string
}

// eslint-disable-next-line @next/next/no-async-client-component
export default async function RecipeDetails({ params }: Props) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=6a6b64b883fd4968beb466488057a5b5`
  )
  const data: RecipeDetailsType = await res.json()

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <div className="relative w-full h-96 mb-6 rounded-xl overflow-hidden">
        <Image src={data.image || '/fallback.png'} alt={data.title} fill className="object-cover" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Ingredients:</h2>
      <ul className="list-disc list-inside mb-4">
        {data.extendedIngredients.map((ing) => (
          <li key={ing.id}>{ing.original}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mb-2">Instructions:</h2>
      <p>{data.instructions}</p>
    </div>
  )
}
