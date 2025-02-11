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
  GYM_EXERCISE_GROUPS,
  GYM_EXERCISES,
  POPULAR_GYM_EXERCISES,
} from '@/constants/gymExercises';
import { GymExerciseType } from '@/types/Activity';
import { Clock, Dumbbell, Plus, Weight, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import AnimateHeight from './AnimateHeight';

interface GymExerciseListProps {
  exercises: GymExerciseType[];
  setExercises: Dispatch<SetStateAction<GymExerciseType[]>>;
}

const GymExerciseSelector = ({
  exercises,
  setExercises,
}: GymExerciseListProps) => {
  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const addSetGroup = (exerciseIndex: number) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              setGroups: [
                ...exercise.setGroups,
                hasDuration(exercise)
                  ? {
                      sets: 0,
                      duration: 0,
                    }
                  : {
                      sets: 0,
                      reps: 0,
                      weight: 0,
                    },
              ],
            }
          : exercise
      )
    );
  };

  const removeSetGroup = (exerciseIndex: number, setGroupIndex: number) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              setGroups: exercise.setGroups.filter(
                (_, si) => si !== setGroupIndex
              ),
            }
          : exercise
      )
    );
  };

  const updateSetGroup = (
    exerciseIndex: number,
    setGroupIndex: number,
    field: 'sets' | 'reps' | 'weight' | 'duration',
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              setGroups: exercise.setGroups.map((setGroup, si) =>
                si === setGroupIndex
                  ? {
                      ...setGroup,
                      [field]: value === '' ? 0 : parseInt(value, 10) || 0,
                    }
                  : setGroup
              ),
            }
          : exercise
      )
    );
  };

  const hasDuration = (exercise: GymExerciseType) => {
    return (
      'hasDuration' in
      GYM_EXERCISES[exercise.name as keyof typeof GYM_EXERCISES]
    );
  };

  return (
    <div className="space-y-2">
      <Select
        value=""
        onValueChange={(value: keyof typeof GYM_EXERCISES) => {
          const hasDuration = 'hasDuration' in GYM_EXERCISES[value];
          setExercises((prev) => [
            {
              name: value,
              setGroups: [
                {
                  sets: 0,
                  weight: 0,
                  ...(hasDuration
                    ? { duration: 0, reps: undefined }
                    : { reps: 0, duration: undefined }),
                },
              ],
            } as GymExerciseType,
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
            {POPULAR_GYM_EXERCISES.map((key) => (
              <SelectItem key={key} value={key}>
                {GYM_EXERCISES[key].name}
              </SelectItem>
            ))}
          </SelectGroup>
          {Object.entries(GYM_EXERCISE_GROUPS).map(([groupKey, groupName]) => (
            <SelectGroup key={groupKey}>
              <SelectLabel>{groupName}</SelectLabel>
              {Object.entries(GYM_EXERCISES)
                .filter(
                  ([key, exercise]) =>
                    exercise.group === groupName &&
                    !POPULAR_GYM_EXERCISES.includes(
                      key as keyof typeof GYM_EXERCISES
                    )
                )
                .map(([key, exercise]) => (
                  <SelectItem key={key} value={key}>
                    {exercise.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <AnimateHeight isOpen={exercises.length > 0}>
        <div className="space-y-4 bg-stone-50 border p-4 rounded-md">
          {exercises.map((exercise, exerciseIndex) => (
            <div
              key={`${exercise.name}-${exerciseIndex}`}
              className="flex gap-3 p-3 border rounded-md flex-col bg-white"
            >
              <div className="flex justify-between items-center gap-2">
                <span>
                  {
                    GYM_EXERCISES[exercise.name as keyof typeof GYM_EXERCISES]
                      .name
                  }
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Separator />
              <div className="space-y-4">
                {exercise.setGroups.map((setGroup, setGroupIndex) => (
                  <div
                    key={`${exercise.name}-${exerciseIndex}-${setGroupIndex}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 justify-between w-full">
                      <div className="flex gap-1.5 items-center justify-center">
                        <span className="text-sm font-medium text-stone-700">
                          Sets
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={setGroup.sets}
                          maxLength={2}
                          onChange={(e) =>
                            updateSetGroup(
                              exerciseIndex,
                              setGroupIndex,
                              'sets',
                              e.target.value
                            )
                          }
                          onFocus={(e) => {
                            e.target.value = '';
                            updateSetGroup(
                              exerciseIndex,
                              setGroupIndex,
                              'sets',
                              ''
                            );
                          }}
                          className="w-10 h-8 px-1.5"
                          placeholder="0"
                        />
                      </div>

                      {hasDuration(exercise) ? (
                        <div className="flex gap-1.5 items-center justify-end">
                          <Clock className="size-4 text-stone-700" />
                          <div className="relative">
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={setGroup.duration}
                              onChange={(e) =>
                                updateSetGroup(
                                  exerciseIndex,
                                  setGroupIndex,
                                  'duration',
                                  e.target.value
                                )
                              }
                              onFocus={(e) => {
                                e.target.value = '';
                                updateSetGroup(
                                  exerciseIndex,
                                  setGroupIndex,
                                  'duration',
                                  ''
                                );
                              }}
                              maxLength={3}
                              className="w-[72px] h-8 px-1.5 pr-9"
                              placeholder="0"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                              min
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-1.5 items-center justify-center">
                            <span className="text-sm font-medium text-stone-700">
                              Reps
                            </span>
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={setGroup.reps}
                              maxLength={2}
                              onChange={(e) =>
                                updateSetGroup(
                                  exerciseIndex,
                                  setGroupIndex,
                                  'reps',
                                  e.target.value
                                )
                              }
                              onFocus={(e) => {
                                e.target.value = '';
                                updateSetGroup(
                                  exerciseIndex,
                                  setGroupIndex,
                                  'reps',
                                  ''
                                );
                              }}
                              className="w-12 h-8 px-1.5"
                              placeholder="0"
                            />
                          </div>

                          <div className="flex gap-1.5 items-center justify-center">
                            <Weight className="size-4 text-stone-700" />
                            <div className="relative">
                              <Input
                                type="text"
                                inputMode="numeric"
                                value={setGroup.weight}
                                onChange={(e) =>
                                  updateSetGroup(
                                    exerciseIndex,
                                    setGroupIndex,
                                    'weight',
                                    e.target.value
                                  )
                                }
                                onFocus={(e) => {
                                  e.target.value = '';
                                  updateSetGroup(
                                    exerciseIndex,
                                    setGroupIndex,
                                    'weight',
                                    ''
                                  );
                                }}
                                maxLength={3}
                                className="w-16 h-8 px-1.5 pr-6"
                                placeholder="0"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                                kg
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {exercise.setGroups.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                          removeSetGroup(exerciseIndex, setGroupIndex)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => addSetGroup(exerciseIndex)}
                >
                  <Plus /> Add Row
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default GymExerciseSelector;
