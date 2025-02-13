import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BaseNutrition,
  DrinkUnit,
  DrinkUnits,
  FoodUnit,
  FoodUnits,
  Ingredient,
  MealEntryType,
  MealEntryTypes,
} from '@/types/Nutrition';
import { useState } from 'react';
import BaseNutritionInputs from './BaseNutritionInputs';

interface AddIgredientsProps {
  entryType: MealEntryType;
  onAddIngredient: (ingredients: Ingredient[]) => void;
}

const AddIngredients = ({ entryType, onAddIngredient }: AddIgredientsProps) => {
  const [ingredientName, setIngredientName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [unit, setUnit] = useState<FoodUnit | DrinkUnit>(
    entryType === MealEntryTypes.Food ? 'g' : 'ml'
  );
  const [nutrition, setNutrition] = useState<BaseNutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });
  // const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const handleAdd = () => {
    const numberAmount = Number(amount);
    // if (!ingredientName || !amount || numberAmount <= 0) {
    //   setError('Please fill in the required fields.');
    //   return;
    // }

    const newIngredient: Ingredient = {
      name: ingredientName,
      amount: numberAmount,
      unit,
      ...nutrition,
    };

    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    onAddIngredient(updatedIngredients);
    setIngredientName('');
    setAmount('');
    setNutrition({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    });
    // setError(null);
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
    onAddIngredient(updatedIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-b-md p-4 bg-white border-t-0 grid grid-cols-2 gap-2">
        <Input
          type="text"
          placeholder="Ingredient name*"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          className="col-span-2"
        />
        <Input
          type="number"
          placeholder="Amount*"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          value={unit}
          onValueChange={(value) => setUnit(value as FoodUnit | DrinkUnit)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent className="mt-0">
            {entryType === MealEntryTypes.Food
              ? Object.values(FoodUnits).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))
              : Object.values(DrinkUnits).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <BaseNutritionInputs
          onChange={setNutrition}
          className="col-span-2 border-none rounded-md p-0 [&>label]:hidden"
        />

        {/* {error && (
          <p className="text-red-500 bg-red-100 rounded-md py-1 px-3 w-full text-center col-span-2">
            {error}
          </p>
        )} */}
        <Button
          onClick={handleAdd}
          className="col-span-2"
          disabled={!ingredientName || !amount || Number(amount) <= 0}
        >
          Add Ingredient
        </Button>
      </div>

      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div
            key={`${ingredient.name}-${index}`}
            className="flex justify-between items-center p-2 border rounded-md"
          >
            <div className="flex flex-col">
              <span className="font-medium">{`${ingredient.name} - ${ingredient.amount}${ingredient.unit}`}</span>
              <span className="text-sm text-muted-foreground">{`${ingredient.calories}kcal | P:${ingredient.protein}g C:${ingredient.carbs}g F:${ingredient.fat}g Fiber:${ingredient.fiber}g`}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveIngredient(index)}
            >
              X
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddIngredients;
