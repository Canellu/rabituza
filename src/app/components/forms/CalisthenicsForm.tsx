'use client';

import { CALISTHENICS_EXERCISES } from '@/constants/calisthenicsExercises';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity'; // Import updateActivity
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  CalisthenicsDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ActivityDateTimePicker from '../Activities/ActivityDateTimePicker';
import { ActivityRatings } from '../Activities/ActivityRatings';
import ActivityNotes from '../ActivityNotes';
import CalisthenicsExerciseSelector from '../CalisthenicsExerciseSelector';
import SaveActivityButton from '../SaveActivityButton';

interface Exercise {
  name: keyof typeof CALISTHENICS_EXERCISES;
  sets: number | '';
  reps: number | '';
  weight: number | '';
}

interface CalisthenicsFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & CalisthenicsDataType;
}

const CalisthenicsForm = ({ onClose, initialData }: CalisthenicsFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [activityDate, setActivityDate] = useState(
    initialData?.activityDate || new Date()
  );
  const [exercises, setExercises] = useState<Exercise[]>(
    initialData?.exercises.map((exercise) => ({
      name: exercise.name as keyof typeof CALISTHENICS_EXERCISES,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
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
      data: CalisthenicsDataType &
        Pick<BaseActivityType, 'ratings' | 'activityDate'>
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

  return (
    <div className="flex flex-col gap-4">
      <ActivityDateTimePicker
        date={activityDate}
        onDateChange={setActivityDate}
      />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <CalisthenicsExerciseSelector
        exercises={exercises}
        setExercises={setExercises}
      />

      <ActivityNotes note={note} onNoteChange={setNote} />

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
