'use client';

import { Button } from '@/components/ui/button';
import { Ingredient } from '@/types/Nutrition';

interface IngredientCardProps {
  ingredient: Ingredient;
  onRemove: () => void;
}

const IngredientCard = ({ ingredient, onRemove }: IngredientCardProps) => {
  return (
    <div className="p-3 border rounded flex items-center justify-between">
      <div>
        <div className="font-medium">{ingredient.name}</div>
        <div className="text-sm text-stone-500">
          {ingredient.amount}
          {ingredient.unit} • {ingredient.calories}kcal • {ingredient.protein}g
          protein
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        Remove
      </Button>
    </div>
  );
};

export default IngredientCard;
