import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MealItem } from '@/types/Nutrition';
import { X } from 'lucide-react';
import { useState } from 'react';

import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CardBadge from '../../CardBadge';
import * as ResizablePanel from '../../ResizablePanel';
import { BaseNutritionStringed } from './BaseNutritionInputs';
import MealManualForm from './MealManualForm';
import MealSearchForm from './MealSearchForm';

interface MealItemEditor {
  mealItem: MealItem;
  onUpdateMealItem: (mealItem: MealItem) => void;
  onRemoveMealItem: () => void;
}

const InputModes = {
  MANUAL: 'manual',
  SEARCH: 'search',
} as const;
export type InputMode = (typeof InputModes)[keyof typeof InputModes];

const MealItemEditor = ({
  mealItem,
  onUpdateMealItem,
  onRemoveMealItem,
}: MealItemEditor) => {
  const [isExpanded, setIsExpanded] = useState<'expanded' | 'collapsed'>(
    'expanded'
  );
  const [inputMode, setInputMode] = useState<InputMode>(InputModes.MANUAL);

  const [itemName, setItemName] = useState(mealItem.name || '');
  const [calories, setCalories] = useState('');
  const [quantity, setQuantity] = useState('');
  const [baseNutrition, setBaseNutrition] = useState<BaseNutritionStringed>({
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
  });

  const handleClickConfirm = () => {
    const updatedMealItem: MealItem = {
      ...mealItem,
      name: itemName,
      calories:
        Number(baseNutrition.calories) > 0 ? Number(baseNutrition.calories) : 0,
      protein:
        Number(baseNutrition.protein) > 0 ? Number(baseNutrition.protein) : 0,
      carbs: Number(baseNutrition.carbs) > 0 ? Number(baseNutrition.carbs) : 0,
      fat: Number(baseNutrition.fat) > 0 ? 0 : Number(baseNutrition.fat),
      fiber: Number(baseNutrition.fiber) > 0 ? Number(baseNutrition.fiber) : 0,
    };

    onUpdateMealItem(updatedMealItem);
    setIsExpanded('collapsed');
  };

  return (
    <ResizablePanel.Root
      value={isExpanded}
      className="bg-white border p-4 rounded-md relative pr-11"
    >
      {/* Header */}
      <div
        className={cn(
          'flex-row-reverse items-center justify-between',
          isExpanded === 'expanded' && 'mb-2'
        )}
        onClick={() => setIsExpanded('expanded')}
      >
        <CardBadge className="float-right whitespace-nowrap ml-1 py-1">
          {baseNutrition.calories} kcal
        </CardBadge>
        {/* Title */}
        <h2
          className={cn(
            'font-medium first-letter:capitalize leading-relaxed',
            !itemName && 'text-stone-500 font-normal'
          )}
        >
          {itemName || 'Food/Drink'}
        </h2>
      </div>

      {/* X button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemoveMealItem}
        className="absolute top-0.5 right-0.5"
      >
        <X />
      </Button>

      <ResizablePanel.Content value="expanded">
        <Separator className="mb-2" />
        <div className="flex flex-col gap-4">
          {/* Input Mode selector */}
          <div className="space-y-1">
            <Label className="text-sm">Input mode</Label>
            <ToggleGroup
              type="single"
              value={inputMode}
              onValueChange={(value) => {
                if (value) {
                  setInputMode(value as InputMode);
                }
              }}
              className="grid grid-cols-2 bg-stone-50 border rounded-md p-1 grow"
            >
              <ToggleGroupItem
                value={InputModes.MANUAL}
                className="data-[state=on]:bg-stone-200 capitalize min-h-max h-8"
              >
                Manual
              </ToggleGroupItem>
              <ToggleGroupItem
                value={InputModes.SEARCH}
                className="data-[state=on]:bg-stone-200 capitalize min-h-max h-8"
              >
                Search
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Manual Input */}
          {inputMode === InputModes.MANUAL && (
            <MealManualForm
              itemName={itemName}
              setItemName={setItemName}
              calories={calories}
              setCalories={setCalories}
              quantity={quantity}
              setQuantity={setQuantity}
              baseNutrition={baseNutrition}
              setBaseNutrition={setBaseNutrition}
            />
          )}

          {inputMode === InputModes.SEARCH && (
            <MealSearchForm
              itemName={itemName}
              setItemName={setItemName}
              mealItem={mealItem}
              onUpdateMealItem={onUpdateMealItem}
            />
          )}

          <Button
            variant="default"
            size="sm"
            onClick={handleClickConfirm}
            disabled={
              (!baseNutrition.calories &&
                Number(baseNutrition.calories) === 0) ||
              !itemName
            }
          >
            Confirm
          </Button>
        </div>
      </ResizablePanel.Content>
      <ResizablePanel.Content value="collapsed">
        <div className="flex gap-2 flex-col items-start">
          <div className="text-xs flex gap-2 flex-nowrap text-nowrap text-stone-500">
            {Object.entries(baseNutrition).map(([key, value], index) => {
              if (key === 'calories') return null;
              if (Number(value) === 0 || !value) return null;
              return (
                <div key={key}>
                  <span>
                    {key[0].toUpperCase() + key.slice(1)}:{' '}
                    {baseNutrition[key as keyof BaseNutritionStringed]}
                  </span>
                  <span>{key === 'calories' ? 'kcal' : 'g'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </ResizablePanel.Content>
    </ResizablePanel.Root>
  );
};

export default MealItemEditor;
