import Image from 'next/image';
import { Recipe } from '@/lib/api';

interface Props {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: Props) => {
  return (
    <div className="card p-4 flex flex-col">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={recipe.image || '/fallback.png'}
          alt={recipe.title}
          fill
          className="rounded-lg object-cover"
        />
      </div>
      <h3 className="font-bold text-lg">{recipe.title}</h3>
    </div>
  );
};

export default RecipeCard;
