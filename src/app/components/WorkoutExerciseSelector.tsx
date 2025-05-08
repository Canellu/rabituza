'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';
import { cn } from '@/lib/utils';
import { Loader2, Search, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import SelectedExercisesList from './SelectedExercisesList';

export type WorkoutSetStringedType = {
  sets: string;
  weight: string;
} & (
  | {
      reps: string;
      duration?: never;
    }
  | {
      duration: string;
      reps?: never;
    }
);

export type WorkoutExerciseStringedType = {
  name: keyof typeof WORKOUT_EXERCISES;
  setGroups: WorkoutSetStringedType[];
};

interface WorkoutExerciseListProps {
  exercises: WorkoutExerciseStringedType[];
  setExercises: Dispatch<SetStateAction<WorkoutExerciseStringedType[]>>;
}

const WorkoutExerciseSelector = ({
  exercises,
  setExercises,
}: WorkoutExerciseListProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(
    Object.entries(WORKOUT_EXERCISES)
  );
  const [searchText, setSearchText] = useState('');

  const handleSearch = (searchTerm: string) => {
    setIsSearching(false);
    const normalizedSearchTerm = searchTerm.toLowerCase().split(/[\s-]+/);

    const matchedExercises = Object.entries(WORKOUT_EXERCISES).filter(
      ([_key, exercise]) => {
        const exerciseName = exercise.name.toLowerCase();
        const exerciseGroup = exercise.group.toLowerCase();
        return normalizedSearchTerm.every(
          (searchWord) =>
            exerciseName.includes(searchWord) ||
            exerciseGroup.includes(searchWord)
        );
      }
    );
    // Sort the matched exercises to prioritize exact matches
    matchedExercises.sort(([_keyA, exerciseA], [_keyB, exerciseB]) => {
      const exerciseNameA = exerciseA.name.toLowerCase();
      const exerciseNameB = exerciseB.name.toLowerCase();
      const exactMatchA = exerciseNameA === searchTerm.toLowerCase();
      const exactMatchB = exerciseNameB === searchTerm.toLowerCase();

      if (exactMatchA && !exactMatchB) return -1;
      if (!exactMatchA && exactMatchB) return 1;
      return 0;
    });
    setSearchResults(matchedExercises);
  };

  const handleClear = () => {
    setSearchResults(Object.entries(WORKOUT_EXERCISES));
    setSearchText('');
  };

  const handleSelectExercise = (
    exerciseName: keyof typeof WORKOUT_EXERCISES
  ) => {
    const exercise = WORKOUT_EXERCISES[exerciseName];
    if (!exercise) {
      console.error(`Exercise not found: ${exerciseName}`);
      return;
    }

    const exerciseHasDuration =
      ('hasDuration' in exercise && exercise.hasDuration) || false;

    setExercises((prev) => [
      {
        name: exerciseName,
        setGroups: [
          {
            sets: '',
            weight: '0',
            ...(exerciseHasDuration
              ? { duration: '', reps: undefined }
              : { reps: '', duration: undefined }),
          },
        ],
      } as WorkoutExerciseStringedType,
      ...prev,
    ]);
    setSearchResults(Object.entries(WORKOUT_EXERCISES));
    setSearchText('');
  };

  return (
    <>
      <div className={cn('')}>
        <div className="relative">
          <div className="flex items-center justify-center absolute top-0 left-0 h-full aspect-square">
            <Search className="size-4 text-stone-400" />
          </div>
          <Input
            type="text"
            placeholder="Search & add exercises"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value.length > 2) setIsSearching(true);
              handleSearch(e.target.value);
            }}
            className={cn('px-9 dark:focus-within:!bg-stone-800')}
          />
          {searchText.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-0 top-0 text-stone-400"
            >
              <X />
            </Button>
          )}
        </div>

        <div className="max-h-[270px] overflow-y-auto border rounded-md mt-1 overscroll-contain relative dark:border-stone-800 dark:bg-stone-800">
          {isSearching && (
            <div
              className={cn(
                'p-2 text-sm text-muted-foreground flex items-center gap-2'
              )}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
          {searchResults.map(([exerciseKey, exercise]) => (
            <div
              key={exerciseKey}
              onClick={() =>
                handleSelectExercise(
                  exerciseKey as keyof typeof WORKOUT_EXERCISES
                )
              }
              className="p-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 select-none"
            >
              <div className="flex flex-col">
                <span className="dark:text-stone-200">{exercise.name}</span>
                <span className="text-sm text-stone-400">{exercise.group}</span>
              </div>
            </div>
          ))}
          {!!searchResults.length && (
            <div className="px-2 py-1 text-xs text-muted-foreground sticky bottom-0 border-t bg-stone-50 w-full dark:bg-stone-800 dark:border-t-stone-600">
              {searchResults.length} result
              {searchResults.length > 1 ? 's' : ''} found
            </div>
          )}
        </div>
      </div>

      {exercises.length > 0 && (
        <SelectedExercisesList
          exercises={exercises}
          setExercises={setExercises}
        />
      )}
    </>
  );
};

export default WorkoutExerciseSelector;
