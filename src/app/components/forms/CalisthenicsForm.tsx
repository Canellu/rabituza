'use client';

import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity'; // Import updateActivity
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  CalisthenicsDataType,
  CalisthenicsExerciseType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ActivityDateTimePicker from '../Activities/ActivityDateTimePicker';
import { ActivityRatings } from '../Activities/ActivityRatings';
import ActivityNotes from '../ActivityNotes';
import CalisthenicsExerciseSelector from '../CalisthenicsExerciseSelector';
import SaveActivityButton from '../SaveActivityButton';

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
  const [exercises, setExercises] = useState<CalisthenicsExerciseType[]>(
    initialData?.exercises || []
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
      exercises: exercises.map((exercise) => ({
        name: exercise.name,
        setGroups: exercise.setGroups.map((setGroup) => {
          const base = {
            sets: Number(setGroup.sets),
            weight: Number(setGroup.weight || 0),
          };

          if ('duration' in setGroup) {
            return {
              ...base,
              duration: Number(setGroup.duration),
            };
          } else {
            return {
              ...base,
              reps: Number(setGroup.reps),
            };
          }
        }),
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
          exercises.some((exercise) =>
            exercise.setGroups.some((setGroup) => {
              const hasValidSets = setGroup.sets && Number(setGroup.sets) > 0;
              console.log(setGroup);
              if ('duration' in setGroup) {
                // Duration-based: requires sets and duration
                return (
                  !hasValidSets ||
                  !setGroup.duration ||
                  Number(setGroup.duration) < 1
                );
              } else {
                // Rep-based: requires sets and reps
                return (
                  !hasValidSets || !setGroup.reps || Number(setGroup.reps) < 1
                );
              }
            })
          )
        }
        onClick={handleSubmit}
      />
    </div>
  );
};

export default CalisthenicsForm;
