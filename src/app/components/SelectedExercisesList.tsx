import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';
import { hasDuration } from '@/lib/utils/hasDuration';
import { Clock, Plus, Weight, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { WorkoutExerciseStringedType } from './WorkoutExerciseSelector';

interface SelectedExercisesListProps {
  exercises: WorkoutExerciseStringedType[];
  setExercises: Dispatch<SetStateAction<WorkoutExerciseStringedType[]>>;
}

const SelectedExercisesList = ({
  exercises,
  setExercises,
}: SelectedExercisesListProps) => {
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
                hasDuration(exercise.name)
                  ? {
                      sets: '',
                      duration: '',
                      weight: '0',
                    }
                  : {
                      sets: '',
                      reps: '',
                      weight: '0',
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
                      [field]: value, // Store as string
                    }
                  : setGroup
              ),
            }
          : exercise
      )
    );
  };

  return (
    <div className="space-y-2">
      {exercises.map((exercise, exerciseIndex) => {
        const exerciseConfig = WORKOUT_EXERCISES[exercise.name];
        console.log(exerciseConfig);
        return (
          <div
            key={`${exercise.name}-${exerciseIndex}`}
            className="flex gap-2 p-3 border rounded-md flex-col bg-stone-50 dark:bg-stone-800 dark:border-transparent"
          >
            <div className="flex justify-between items-center gap-2">
              <span className="dark:text-stone-200">
                {WORKOUT_EXERCISES[exercise.name].name}
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
                      <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
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

                    {hasDuration(exercise.name) ? (
                      <div className="flex gap-1.5 items-center justify-end">
                        <Clock className="size-4 text-stone-700 dark:text-stone-400" />
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
                            {exerciseConfig.hasDuration &&
                            exerciseConfig.durationUnit === 'minutes'
                              ? 'min'
                              : 'sec'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5 items-center justify-center">
                          <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
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
                      </>
                    )}
                    <div className="flex gap-1.5 items-center justify-center">
                      <Weight className="size-4 text-stone-700 dark:text-stone-400" />
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
        );
      })}
    </div>
  );
};

export default SelectedExercisesList;
