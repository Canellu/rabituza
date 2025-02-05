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
import { Textarea } from '@/components/ui/textarea';
import { createActivity } from '@/lib/database/activities/createActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  CALISTHENICS_EXERCISES,
  CalisthenicsDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dumbbell, X } from 'lucide-react';
import { useState } from 'react';
import ActivityDateTimePicker from './ActivityDateTimePicker';
import { ActivityRatings } from './ActivityRatings';
import AnimateHeight from './AnimateHeight';
import SaveActivityButton from './SaveActivityButton';

interface Exercise {
  name: keyof typeof CALISTHENICS_EXERCISES;
  sets: number | '';
  reps: number | '';
  weight: number | '';
}

interface CalisthenicsFormProps {
  onClose: () => void;
}

const POPULAR_EXERCISES: (keyof typeof CALISTHENICS_EXERCISES)[] = [
  'pushUp',
  'pullUp',
  'squats',
  'sitUp',
];

const CalisthenicsForm = ({ onClose }: CalisthenicsFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [activityDate, setActivityDate] = useState<Date>(new Date());
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [ratings, setRatings] = useState<ActivityRatingsType>({
    intensity: 5,
    energy: 5,
    enjoyment: 5,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: CalisthenicsDataType &
        Pick<BaseActivityType, 'ratings' | 'activityDate'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      return createActivity(userId, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities', userId],
        exact: true,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
    },
  });

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

  const [note, setNote] = useState<string>('');

  const handleSubmit = () => {
    if (!userId) return;

    const data = {
      type: ActivityTypes.Calisthenics,
      activityDate,
      ratings,
      note,
      exercises: exercises.map(({ name, sets, reps, weight }) => ({
        name: CALISTHENICS_EXERCISES[name],
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      })),
    };

    mutate(data);
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <ActivityDateTimePicker
        date={activityDate}
        onDateChange={setActivityDate}
      />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

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

      <Textarea
        placeholder="Add notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
      />

      <SaveActivityButton
        isPending={isPending}
        isDisabled={
          exercises.length === 0 ||
          exercises.some(
            (exercise) =>
              typeof exercise.sets !== 'number' ||
              typeof exercise.reps !== 'number' ||
              exercise.sets < 1 ||
              exercise.reps < 1
          )
        }
        onClick={handleSubmit}
      />
    </div>
  );
};

export default CalisthenicsForm;
