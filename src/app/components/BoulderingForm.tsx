'use client';

import BOULDERING_GYMS from '@/constants/boulderingGyms';
import { createActivity } from '@/lib/database/activities/createActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityDataType,
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ActivityDateTimePicker from './ActivityDateTimePicker';
import { ActivityRatings } from './ActivityRatings';
import { BoulderingGradeSelector } from './BoulderingGradeSelector';
import SaveActivityButton from './SaveActivityButton';

interface BoulderingFormProps {
  onClose: () => void;
}

const BoulderingForm = ({ onClose }: BoulderingFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [gradeCount, setGradeCount] = useState<Record<string, number>>({});
  const [activityDate, setActivityDate] = useState<Date>(new Date());
  const [selectedGym, setSelectedGym] = useState<
    keyof typeof BOULDERING_GYMS | ''
  >('');
  const [ratings, setRatings] = useState<ActivityRatingsType>({
    intensity: 5,
    energy: 5,
    enjoyment: 5,
  });

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

  const handleSubmit = async () => {
    if (!userId) return;

    const data = {
      type: ActivityTypes.Bouldering,
      gym: selectedGym,
      activityDate,
      ratings,
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
    <div className="flex flex-col gap-6">
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

export default BoulderingForm;
