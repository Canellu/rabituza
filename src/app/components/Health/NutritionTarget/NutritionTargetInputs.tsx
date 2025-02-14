import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dispatch, SetStateAction } from 'react';
import { NutritionTargetType } from './AddNutritionTarget';

interface NutritionTargetInputsProps {
  target: NutritionTargetType;
  setTarget: Dispatch<SetStateAction<NutritionTargetType>>;
}

const NutritionTargetInputs = ({
  target,
  setTarget,
}: NutritionTargetInputsProps) => {
  return (
    <div className="space-y-2">
      <Label>Nutritional Target Values</Label>
      <div className="grid grid-cols-2 gap-2 border rounded-md p-4 bg-stone-50">
        <Label htmlFor="calories" className="self-center font-normal">
          Calories
        </Label>
        <div className="relative">
          <Input
            id="calories"
            name="calories"
            type="text"
            inputMode="numeric"
            value={target.calories}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                calories: e.target.value,
              }))
            }
            className="pr-12"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
            kcal
          </div>
        </div>
        <Label htmlFor="protein" className="self-center font-normal">
          Protein
        </Label>
        <div className="relative">
          <Input
            id="protein"
            name="protein"
            type="text"
            inputMode="numeric"
            value={target.protein}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                protein: e.target.value,
              }))
            }
            className="pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
            g
          </div>
        </div>
        <Label htmlFor="carbs" className="self-center font-normal">
          Carbs
        </Label>
        <div className="relative">
          <Input
            id="carbs"
            name="carbs"
            type="text"
            inputMode="numeric"
            value={target.carbs}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                carbs: e.target.value,
              }))
            }
            className="pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
            g
          </div>
        </div>
        <Label htmlFor="fat" className="self-center font-normal">
          Fat
        </Label>
        <div className="relative">
          <Input
            id="fat"
            name="fat"
            type="text"
            inputMode="numeric"
            value={target.fat}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                fat: e.target.value,
              }))
            }
            className="pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
            g
          </div>
        </div>
        <Label htmlFor="fiber" className="self-center font-normal">
          Fiber
        </Label>
        <div className="relative">
          <Input
            id="fiber"
            name="fiber"
            type="text"
            inputMode="numeric"
            value={target.fiber}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                fiber: e.target.value,
              }))
            }
            className="pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-muted-foreground">
            g
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTargetInputs;
