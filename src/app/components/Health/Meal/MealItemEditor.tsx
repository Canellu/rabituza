import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MealItem } from '@/types/Nutrition';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import CardBadge from '../../CardBadge';
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
  const [accordion, setAccordion] = useState('edit');
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
      fat: Number(baseNutrition.fat) > 0 ? Number(baseNutrition.fat) : 0,
      fiber: Number(baseNutrition.fiber) > 0 ? Number(baseNutrition.fiber) : 0,
    };

    onUpdateMealItem(updatedMealItem);
    setAccordion('');
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={accordion}
      onValueChange={(value) => setAccordion(value)}
    >
      <AccordionItem value="edit" className="border-none">
        <AccordionTrigger
          className={cn(
            '[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-stone-800 hover:no-underline ',
            'text-start border rounded-md py-3 px-4 bg-stone-50',
            'data-[state=open]:rounded-b-none'
          )}
        >
          <div className="flex flex-col items-start gap-1 grow pr-2">
            <div className="w-full">
              {mealItem.calories > 0 && (
                <CardBadge className="whitespace-nowrap float-right">
                  {mealItem.calories} kcal
                </CardBadge>
              )}
              <h2 className="text-sm leading-relaxed">
                {mealItem.name || 'Fill out form'}
              </h2>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border border-t-0 rounded-b-md p-4  pt-6 bg-white flex flex-col gap-4">
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
              calories={calories}
              setCalories={setCalories}
              quantity={quantity}
              setQuantity={setQuantity}
              baseNutrition={baseNutrition}
              setBaseNutrition={setBaseNutrition}
            />
          )}

          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={onRemoveMealItem}
              className="shrink-0 size-9 "
            >
              <Trash />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleClickConfirm}
              disabled={
                (!baseNutrition.calories &&
                  Number(baseNutrition.calories) === 0) ||
                baseNutrition.calories === '0' ||
                !itemName
              }
              className="w-full"
            >
              Confirm
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MealItemEditor;
