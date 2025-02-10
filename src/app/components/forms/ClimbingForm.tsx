'use client';

import { Textarea } from '@/components/ui/textarea';
import BOULDERING_GYMS from '@/constants/boulderingGyms';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityDataType,
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  ClimbingDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ActivityDateTimePicker from '../Activities/ActivityDateTimePicker';
import { ActivityRatings } from '../Activities/ActivityRatings';
import { BoulderingGradeSelector } from '../BoulderingGradeSelector';
import SaveActivityButton from '../SaveActivityButton';

interface ClimbingFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & ClimbingDataType;
}

const ClimbingForm = ({ onClose, initialData }: ClimbingFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [gradeCount, setGradeCount] = useState<Record<string, number>>(
    initialData?.grades.reduce((acc, { grade, count }) => {
      acc[grade] = count;
      return acc;
    }, {} as Record<string, number>) || {}
  );
  const [activityDate, setActivityDate] = useState<Date>(
    initialData?.activityDate || new Date()
  );
  const [selectedGym, setSelectedGym] = useState<
    keyof typeof BOULDERING_GYMS | ''
  >((initialData?.gym as keyof typeof BOULDERING_GYMS) || '');
  const [ratings, setRatings] = useState<ActivityRatingsType>(
    initialData?.ratings || {
      intensity: 5,
      energy: 5,
      enjoyment: 5,
    }
  );
  const [note, setNote] = useState<string>(initialData?.note || '');

  const handleGymChange = (value: keyof typeof BOULDERING_GYMS | '') => {
    setSelectedGym(value);
    setGradeCount({});
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: ActivityDataType &
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

  const handleSubmit = async () => {
    if (!userId) return;

    const data = {
      type: ActivityTypes.Climbing,
      gym: selectedGym,
      activityDate,
      ratings,
      note,
      grades: Object.entries(gradeCount)
        .filter(([_, count]) => count > 0)
        .map(([grade, count]) => ({
          grade,
          count,
        })),
    };

    mutate(data);
  };

  return (
    <div className="flex flex-col gap-3">
      <ActivityDateTimePicker
        date={activityDate}
        onDateChange={setActivityDate}
      />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <BoulderingGradeSelector
        gradeCount={gradeCount}
        selectedGym={selectedGym}
        onGymChange={handleGymChange}
        onGradeCountChange={setGradeCount}
      />

      <Textarea
        placeholder="Add notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
      />

      <SaveActivityButton
        isPending={isPending}
        isDisabled={
          !selectedGym ||
          Object.values(gradeCount).every((count) => count === 0)
        }
        onClick={handleSubmit}
      />
    </div>
  );
};

export default ClimbingForm;
