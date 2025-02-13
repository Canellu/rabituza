import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DrinkUnit, FoodUnit, Ingredient } from '@/types/Nutrition';
import { useState } from 'react';

const AddIngredients = ({
  onAddIngredient,
}: {
  onAddIngredient: (ingredient: Ingredient) => void;
}) => {
  const [ingredientName, setIngredientName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<FoodUnit | DrinkUnit>('g'); // Default to 'g'

  const handleAdd = () => {
    if (!ingredientName || amount <= 0) return;

    const newIngredient: Ingredient = {
      name: ingredientName,
      amount,
      unit,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };

    onAddIngredient(newIngredient);
    setIngredientName('');
    setAmount(0);
  };

  return (
    <div className="border rounded-b-md p-4 bg-white border-t-0 space-y-2">
      <Input
        type="text"
        placeholder="Ingredient Name"
        value={ingredientName}
        onChange={(e) => setIngredientName(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as FoodUnit | DrinkUnit)}
      >
        <option value="g">Gram</option>
        <option value="kg">Kilogram</option>
        <option value="pc">Piece</option>
        <option value="serving">Serving</option>
        <option value="ml">Milliliter</option>
        <option value="l">Liter</option>
      </select>
      <Button onClick={handleAdd}>Add Ingredient</Button>
    </div>
  );
};

export default AddIngredients;
