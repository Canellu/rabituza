'use client';

import { Textarea } from '@/components/ui/textarea';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity'; // Import updateActivity
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  StretchingDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ActivityDateTimePicker from './ActivityDateTimePicker';
import { ActivityRatings } from './ActivityRatings';
import SaveActivityButton from './SaveActivityButton';
import SessionDuration from './SessionDuration';
import StretchedMusclesSelection from './StretchedMusclesSelection';

interface StretchingFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & StretchingDataType;
}

const StretchingForm = ({ onClose, initialData }: StretchingFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();

  const [activityDate, setActivityDate] = useState<Date>(
    initialData?.activityDate || new Date()
  );
  const [ratings, setRatings] = useState<ActivityRatingsType>(
    initialData?.ratings || {
      intensity: 5,
      energy: 5,
      enjoyment: 5,
    }
  );
  const [duration, setDuration] = useState<number | ''>(
    initialData?.duration || ''
  );
  const [selectedStretches, setSelectedStretches] = useState<string[]>(
    initialData?.stretches || []
  );
  const [note, setNote] = useState<string>(initialData?.note || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: StretchingDataType &
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
      type: ActivityTypes.Stretching,
      activityDate,
      ratings,
      duration: duration ? parseInt(duration.toString(), 10) : 0,
      stretches: selectedStretches,
      note,
    };

    mutate(data);
  };

  const handleStretchChange = (stretches: string[]) => {
    setSelectedStretches(stretches);
  };

  return (
    <div className="flex flex-col gap-3">
      <ActivityDateTimePicker
        date={activityDate}
        onDateChange={setActivityDate}
      />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <SessionDuration duration={duration} onDurationChange={setDuration} />

      <StretchedMusclesSelection
        selectedStretches={selectedStretches}
        onStretchChange={handleStretchChange}
      />

      <Textarea
        placeholder="Add notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="min-h-[100px]"
      />

      <SaveActivityButton
        isPending={isPending}
        isDisabled={selectedStretches.length === 0 || duration === ''}
        onClick={handleSubmit}
      />
    </div>
  );
};

export default StretchingForm;
