'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createNutrition } from '@/lib/database/nutrition/createNutrition';
import { getSession } from '@/lib/utils/userSession';
import {
  Drink,
  Ingredient,
  MealType,
  MealTypes,
  NutritionEntry,
  PreparedMeal,
  Unit,
  Units,
} from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import DateTimePicker from '../DateTimePicker';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';

type MealEntryType = 'homemade' | 'prepared';

const AddNutrition = () => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [entryType, setEntryType] = useState<MealEntryType>('homemade');

  const [mealDate, setMealDate] = useState(new Date());
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [foods, setFoods] = useState<Ingredient[]>([]);
  const [preparedMeals, setPreparedMeals] = useState<PreparedMeal[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [note, setNote] = useState('');

  const [newIngredient, setNewIngredient] = useState<
    Omit<
      Ingredient,
      'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'amount'
    > & {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
      amount: string;
    }
  >({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    amount: '',
    unit: Units.Gram,
  });

  const [newPreparedMeal, setNewPreparedMeal] = useState<
    Omit<
      PreparedMeal,
      'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'servingSize'
    > & {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
      servingSize: string;
    }
  >({
    name: '',
    brand: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    servingSize: '',
    servingUnit: Units.Serving,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: Omit<NutritionEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      return createNutrition(userId, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['nutrition', userId],
        exact: true,
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.error('Error processing nutrition:', error);
    },
  });

  const handleAddIngredient = () => {
    setFoods([
      ...foods,
      {
        ...newIngredient,
        calories: Number(newIngredient.calories) || 0,
        protein: Number(newIngredient.protein) || 0,
        carbs: Number(newIngredient.carbs) || 0,
        fat: Number(newIngredient.fat) || 0,
        fiber: Number(newIngredient.fiber) || 0,
        amount: Number(newIngredient.amount) || 0,
      },
    ]);
    setNewIngredient({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      amount: '',
      unit: Units.Gram,
    });
  };

  const handleAddPreparedMeal = () => {
    setPreparedMeals([
      ...preparedMeals,
      {
        ...newPreparedMeal,
        calories: Number(newPreparedMeal.calories) || 0,
        protein: Number(newPreparedMeal.protein) || 0,
        carbs: Number(newPreparedMeal.carbs) || 0,
        fat: Number(newPreparedMeal.fat) || 0,
        fiber: Number(newPreparedMeal.fiber) || 0,
        servingSize: Number(newPreparedMeal.servingSize) || 0,
      },
    ]);
    setNewPreparedMeal({
      name: '',
      brand: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      servingSize: '',
      servingUnit: Units.Serving,
    });
  };

  <Input
    type="text"
    inputMode="numeric"
    placeholder="Calories"
    value={newIngredient.calories}
    maxLength={4}
    onChange={(e) =>
      setNewIngredient({
        ...newIngredient,
        calories: e.target.value,
      })
    }
    onFocus={(e) => {
      e.target.value = '';
      setNewIngredient({
        ...newIngredient,
        calories: '',
      });
    }}
  />;

  const handleSubmit = () => {
    if (!userId || !mealType) return;

    const data = {
      mealType,
      mealDate,
      foods: entryType === 'homemade' ? foods : [],
      preparedMeals: entryType === 'prepared' ? preparedMeals : [],
      drinks,
      notes: note,
    };

    mutate(data);
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Add meal
      </Button>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="ixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Add Meal</DrawerTitle>
          </DrawerHeader>
          <div className="flex-grow overflow-y-auto">
            <div className="p-4 pb-16 h-full overflow-auto">
              <div className="flex flex-col gap-4">
                <DateTimePicker date={mealDate} onDateChange={setMealDate} />

                {/* Meal Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meal Type</label>
                  <Select
                    onValueChange={(value: MealType) => setMealType(value)}
                    value={mealType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MealTypes).map(([key, value]) => (
                        <SelectItem key={value} value={value}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Entry Type Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entry Type</label>
                  <Select
                    onValueChange={(v: MealEntryType) => setEntryType(v)}
                    value={entryType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homemade">Homemade</SelectItem>
                      <SelectItem value="prepared">Prepared Meal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional Rendering based on Entry Type */}
                {entryType === 'homemade' ? (
                  <div className="space-y-4">
                    <h3 className="font-medium">Ingredients</h3>
                    {foods.map((food, index) => (
                      <div key={index} className="p-2 border rounded">
                        {food.name} - {food.amount}
                        {food.unit}
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={newIngredient.name}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Amount"
                        value={newIngredient.amount}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            amount: e.target.value,
                          })
                        }
                      />
                      <Select
                        value={newIngredient.unit}
                        onValueChange={(v) =>
                          setNewIngredient({
                            ...newIngredient,
                            unit: v as Unit,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(Units).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Calories"
                        value={newIngredient.calories}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            calories: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Protein (g)"
                        value={newIngredient.protein}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            protein: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Carbs (g)"
                        value={newIngredient.carbs}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            carbs: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Fat (g)"
                        value={newIngredient.fat}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            fat: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="Fiber (g)"
                        value={newIngredient.fiber}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            fiber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAddIngredient}>
                      Add Ingredient
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium">Prepared Meals</h3>
                    {preparedMeals.map((meal, index) => (
                      <div key={index} className="p-2 border rounded">
                        {meal.name} - {meal.servingSize}
                        {meal.servingUnit}
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Name"
                        value={newPreparedMeal.name}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Brand"
                        value={newPreparedMeal.brand}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            brand: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Serving Size"
                        value={newPreparedMeal.servingSize}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            servingSize: e.target.value,
                          })
                        }
                      />
                      <Select
                        value={newPreparedMeal.servingUnit}
                        onValueChange={(v) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            servingUnit: v as Unit,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(Units).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="Calories"
                        value={newPreparedMeal.calories}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            calories: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Protein (g)"
                        value={newPreparedMeal.protein}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            protein: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Carbs (g)"
                        value={newPreparedMeal.carbs}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            carbs: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Fat (g)"
                        value={newPreparedMeal.fat}
                        onChange={(e) =>
                          setNewPreparedMeal({
                            ...newPreparedMeal,
                            fat: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAddPreparedMeal}>
                      Add Prepared Meal
                    </Button>
                  </div>
                )}

                <NotesInput note={note} onNoteChange={setNote} />

                <SaveButtonDrawer
                  isPending={isPending}
                  isDisabled={
                    !mealType ||
                    (entryType === 'homemade'
                      ? foods.length === 0
                      : preparedMeals.length === 0)
                  }
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddNutrition;
