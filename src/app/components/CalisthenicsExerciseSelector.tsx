'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  CALISTHENICS_EXERCISES,
  POPULAR_EXERCISES,
} from '@/constants/calisthenicsExercises';
import { Dumbbell, X } from 'lucide-react';
import AnimateHeight from './AnimateHeight';

interface Exercise {
  name: keyof typeof CALISTHENICS_EXERCISES;
  sets: number | '';
  reps: number | '';
  weight: number | '';
}

interface ExerciseListProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

const CalisthenicsExerciseSelector = ({
  exercises,
  setExercises,
}: ExerciseListProps) => {
  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExercise = (
    index: number,
    field: 'sets' | 'reps' | 'weight',
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === index
          ? { ...exercise, [field]: value === '' ? '' : parseInt(value) }
          : exercise
      )
    );
  };

  return (
    <div className="space-y-2">
      <Select
        value=""
        onValueChange={(value: keyof typeof CALISTHENICS_EXERCISES) => {
          setExercises((prev) => [
            { name: value, sets: '', reps: '', weight: '' },
            ...prev,
          ]);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              <div className="flex items-center gap-2 px-1">
                <Dumbbell className="mb-0.5 h-4 w-4" />
                <span className="mt-0.5">Select Exercise</span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Popular</SelectLabel>
            {POPULAR_EXERCISES.map((key) => (
              <SelectItem key={key} value={key}>
                {CALISTHENICS_EXERCISES[key]}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>All Exercises</SelectLabel>
            {Object.entries(CALISTHENICS_EXERCISES)
              .filter(
                ([key]) =>
                  !POPULAR_EXERCISES.includes(
                    key as keyof typeof CALISTHENICS_EXERCISES
                  )
              )
              .map(([key, name]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <AnimateHeight isOpen={exercises.length > 0}>
        <div className="space-y-4 bg-stone-50 border p-4 rounded-md">
          {exercises.map((exercise, index) => (
            <div
              key={`${exercise.name}-${index}`}
              className="flex gap-3 p-3 border rounded-md flex-col bg-white"
            >
              <div className="flex justify-between items-center gap-2">
                {CALISTHENICS_EXERCISES[exercise.name]}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => removeExercise(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 justify-between w-full">
                  <div className="flex gap-1.5 items-center justify-center">
                    <span className="text-sm font-medium text-stone-700">
                      Sets
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={exercise.sets}
                      onChange={(e) =>
                        updateExercise(index, 'sets', e.target.value)
                      }
                      onFocus={(e) => (e.target.value = '')}
                      className="w-12 h-8 px-1.5"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex gap-1.5 items-center justify-center">
                    <span className="text-sm font-medium text-stone-700">
                      Reps
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={exercise.reps}
                      onChange={(e) =>
                        updateExercise(index, 'reps', e.target.value)
                      }
                      onFocus={(e) => (e.target.value = '')}
                      className="w-12 h-8 px-1.5"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-1.5 items-center justify-center">
                    <span className="text-sm font-medium text-stone-700">
                      +kg
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={exercise.weight}
                      onChange={(e) =>
                        updateExercise(index, 'weight', e.target.value)
                      }
                      onFocus={(e) => (e.target.value = '')}
                      className="w-12 h-8 px-1.5"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default CalisthenicsExerciseSelector;
