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
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
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
  const userId = getSession();
  const queryClient = useQueryClient();

  // Calculate duration from route if it exists
  const calculateInitialDuration = () => {
    if (initialData?.duration !== undefined) {
      return initialData.duration;
    }
    if (initialData?.routes?.length) {
      let totalDurationMs = 0;
      initialData.routes.forEach((route) => {
        const start = route.geolocations[0]?.timestamp ?? 0;
        const end =
          route.geolocations[route.geolocations.length - 1]?.timestamp ?? 0;
        if (start && end) {
          totalDurationMs += end - start;
        }
      });
      return Math.floor(totalDurationMs / 1000); // Convert milliseconds to seconds
    }
    return 0;
  };

  // Calculate distance from route if it exists
  const calculateInitialDistance = () => {
    if (initialData?.distance) {
      return initialData.distance.toString();
    }
    return '';
  };

  // Separate state for minutes and seconds using calculated duration
  const initialDuration = initialData ? calculateInitialDuration() : undefined;
  const initialMinutes =
    initialDuration !== undefined && initialDuration !== 0
      ? Math.floor(initialDuration / 60)
      : initialDuration === 0
      ? 0
      : '';
  const initialSeconds =
    initialDuration !== undefined && initialDuration !== 0
      ? initialDuration % 60
      : initialDuration === 0
      ? 0
      : '';

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
  const [distance, setDistance] = useState(calculateInitialDistance());
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

    // Calculate total duration in seconds, handling empty inputs
    const minutes = typeof durationMinutes === 'number' ? durationMinutes : 0;
    const seconds = typeof durationSeconds === 'number' ? durationSeconds : 0;
    const totalDurationSeconds = minutes * 60 + seconds;

    const data = {
      type: ActivityTypes.Running,
      activityDate,
      ratings,
      duration: totalDurationSeconds >= 0 ? totalDurationSeconds : 0,
      distance: distance !== '' ? Number(distance) : 0,
      status,
      note,
      routes: initialData?.routes || [],
    };
    console.log(initialData?.routes);
    mutate(data);
  };

  // Helper to handle input changes for numbers
  const handleNumericChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<number | ''>>
  ) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '') {
      setter('');
    } else if (/^\d+$/.test(value)) {
      setter(parseInt(value, 10));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      {/* Duration Inputs */}
      <div className="space-y-1">
        <Label className="text-sm">Duration</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              value={durationMinutes}
              placeholder="Minutes"
              onChange={(e) => handleNumericChange(e, setDurationMinutes)}
              className="mt-1 p-2 border rounded-md w-full pr-9"
              min="0"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
              min
            </span>
          </div>
          <span>:</span>
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              value={durationSeconds}
              placeholder="Seconds"
              onChange={(e) => handleNumericChange(e, setDurationSeconds)}
              className="mt-1 p-2 border rounded-md w-full pr-9"
              min="0"
              max="59"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
              sec
            </span>
          </div>
        </div>
      </div>

      {/* Distance Input */}
      <div className="space-y-1">
        <Label className="text-sm">Distance (meters)</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={distance}
          placeholder="Distance ran"
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
