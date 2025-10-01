import RecipeDetails from '@/components/RecipeDetails'

export default function Page({ params }: { params: { id: string } }) {
  return <RecipeDetails id={params.id} />
}