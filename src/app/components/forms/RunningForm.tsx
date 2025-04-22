'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  DistanceActivitySessionStatus,
  DistanceActivitySessionStatuses,
  RunningDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityRatings } from '../Activities/ActivityRatings';
import DateTimePicker from '../DateTimePicker';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';
import StatusSelector from '../StatusSelector';

interface RunningFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & RunningDataType;
}

const RunningForm = ({ onClose, initialData }: RunningFormProps) => {
  console.log(initialData);
  const userId = getSession();
  const queryClient = useQueryClient();

  // Separate state for minutes and seconds
  const initialMinutes = initialData?.duration
    ? Math.floor(initialData.duration / 60)
    : '';
  const initialSeconds = initialData?.duration ? initialData.duration % 60 : '';

  const [status, setStatus] = useState<DistanceActivitySessionStatus>(
    initialData?.status || DistanceActivitySessionStatuses.inProgress
  );
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

  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialMinutes
  );
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(
    initialSeconds
  );
  const [distance, setDistance] = useState(initialData?.distance || '');
  const [note, setNote] = useState<string>(initialData?.note || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: RunningDataType & Pick<BaseActivityType, 'ratings' | 'activityDate'>
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

    // Calculate total duration in seconds, default to 0 if inputs are empty
    const totalDurationSeconds =
      (Number(durationMinutes) || 0) * 60 + (Number(durationSeconds) || 0);

    const data = {
      type: ActivityTypes.Running,
      activityDate,
      ratings,
      // Save 0 if duration wasn't entered, otherwise save calculated value
      duration: totalDurationSeconds,
      // Save 0 if distance wasn't entered, otherwise save entered value
      distance: distance !== '' ? Number(distance) : 0,
      status: status,
      note,
    };

    mutate(data);
  };

  // Helper to handle input changes for numbers
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<number | ''>>
  ) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^\d+$/.test(value)) {
      setter(value === '' ? '' : parseInt(value, 10));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      {/* Duration Inputs */}
      <div className="space-y-1">
        <Label className="text-sm">Duration (Optional)</Label>{' '}
        {/* Updated Label */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="number"
              inputMode="numeric"
              value={durationMinutes}
              placeholder="Minutes" // Keep placeholder
              onChange={(e) => handleNumericChange(e, setDurationMinutes)}
              className="mt-1 p-2 border rounded-md w-full"
              min="0"
            />
          </div>
          <span>:</span>
          <div className="flex-1">
            <Input
              type="number"
              inputMode="numeric"
              value={durationSeconds}
              placeholder="Seconds" // Keep placeholder
              onChange={(e) => handleNumericChange(e, setDurationSeconds)}
              className="mt-1 p-2 border rounded-md w-full"
              min="0"
              max="59"
            />
          </div>
        </div>
      </div>

      {/* Distance Input */}
      <div className="space-y-1">
        <Label className="text-sm">Distance (meters, Optional)</Label>{' '}
        {/* Updated Label */}
        <Input
          type="text"
          inputMode="numeric"
          value={distance}
          placeholder="Distance ran" // Keep placeholder
          onChange={(e) => setDistance(e.currentTarget.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      {/* Status Selector */}
      <StatusSelector status={status} onStatusChange={setStatus} />

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        onClick={handleSubmit}
        isDisabled={false}
      />
    </div>
  );
};

export default RunningForm;
