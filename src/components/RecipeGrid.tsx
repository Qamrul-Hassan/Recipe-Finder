import { Recipe } from '@/lib/api';
import RecipeCard from './RecipeCard';

interface Props {
  recipes: Recipe[];
}

export const RecipeGrid = ({ recipes }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  );
};
