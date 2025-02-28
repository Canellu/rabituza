'use client';

import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { hasDuration } from '@/lib/utils/hasDuration';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  WorkoutDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityRatings } from '../Activities/ActivityRatings';
import DateTimePicker from '../DateTimePicker';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';
import WorkoutExerciseSelector, {
  WorkoutExerciseStringedType,
} from '../WorkoutExerciseSelector';

interface WorkoutFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & WorkoutDataType;
}

const WorkoutForm = ({ onClose, initialData }: WorkoutFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [activityDate, setActivityDate] = useState(
    initialData?.activityDate || new Date()
  );
  const [exercises, setExercises] = useState<WorkoutExerciseStringedType[]>(
    initialData?.exercises.map((exercise) => ({
      name: exercise.name,
      setGroups: exercise.setGroups.map((setGroup) => ({
        sets: setGroup.sets.toString(),
        weight: setGroup.weight?.toString() || '0',
        ...(hasDuration(exercise.name)
          ? { duration: setGroup.duration?.toString() || '0' }
          : {
              reps: setGroup.reps?.toString() || '0',
            }),
      })),
    })) || []
  );
  const [ratings, setRatings] = useState<ActivityRatingsType>(
    initialData?.ratings || {
      intensity: 5,
      energy: 5,
      enjoyment: 5,
    }
  );
  const [note, setNote] = useState<string>(initialData?.note || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: WorkoutDataType & Pick<BaseActivityType, 'ratings' | 'activityDate'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      if (initialData?.id) {
        return updateActivity(userId, initialData.id, data);
      } else {
        return createActivity(userId, data);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities', userId],
        exact: true,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error processing activity:', error);
    },
  });

  const handleSubmit = () => {
    if (!userId) return;

    const data = {
      type: ActivityTypes.Workout,
      activityDate,
      ratings,
      note,
      exercises: exercises.map((exercise) => {
        return {
          name: exercise.name,
          setGroups: exercise.setGroups.map((setGroup) => {
            if (hasDuration(exercise.name)) {
              return {
                sets: Number(setGroup.sets),
                duration: Number(setGroup.duration),
                weight: Number(setGroup.weight),
              };
            } else {
              return {
                sets: Number(setGroup.sets),
                reps: Number(setGroup.reps),
                weight: Number(setGroup.weight),
              };
            }
          }),
        };
      }),
    };

    mutate(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <WorkoutExerciseSelector
        exercises={exercises}
        setExercises={setExercises}
      />

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        isDisabled={
          exercises.length === 0 ||
          exercises.some((exercise) =>
            exercise.setGroups.some((setGroup) => {
              const hasDuration =
                'hasDuration' in
                WORKOUT_EXERCISES[
                  exercise.name as keyof typeof WORKOUT_EXERCISES
                ];
              return (
                !setGroup.sets ||
                Number(setGroup.sets) < 1 ||
                (hasDuration
                  ? !setGroup.duration || Number(setGroup.duration) < 1
                  : !setGroup.reps || Number(setGroup.reps) < 1)
              );
            })
          )
        }
        onClick={handleSubmit}
      />
    </div>
  );
};

export default WorkoutForm;
