'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { calculateTotalDistance } from '@/lib/utils/geolocation';
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
import SavedRoutesList from '../Activities/SavedRoutesList';
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
  // Calculate distance from route if it exists
  const calculateInitialDistance = () => {
    if (initialData?.distance) {
      return (initialData.distance / 1000).toFixed(2).toString();
    }
    if (initialData?.routes?.length) {
      return (calculateTotalDistance(initialData.routes) / 1000)
        .toFixed(2)
        .toString();
    }
    return '';
  };

  // Calculate duration from routes if they exist
  const calculateInitialDuration = () => {
    if (initialData?.duration !== undefined) {
      return initialData.duration;
    }
    if (initialData?.routes?.length) {
      const totalDurationMs = initialData.routes.reduce((total, route) => {
        const firstLocation = route.geolocations[0];
        const lastLocation = route.geolocations[route.geolocations.length - 1];
        if (firstLocation?.timestamp && lastLocation?.timestamp) {
          return (
            total +
            (new Date(lastLocation.timestamp).getTime() -
              new Date(firstLocation.timestamp).getTime())
          );
        }
        return total;
      }, 0);
      return Math.floor(totalDurationMs / 1000); // Convert to seconds
    }
    return undefined;
  };

  // Separate state for minutes and seconds using calculated duration
  const initialMinutes = () => {
    const duration = calculateInitialDuration();
    if (duration === undefined) return '';
    return Math.floor(duration / 60);
  };

  const initialSeconds = () => {
    const duration = calculateInitialDuration();
    if (duration === undefined) return '';
    return duration % 60;
  };

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

  const [routes, setRoutes] = useState(initialData?.routes || []);

  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialMinutes()
  );
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(
    initialSeconds()
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

  const handleDeleteRoute = (routeId: string) => {
    setRoutes((currentRoutes) =>
      currentRoutes.filter((route) => route.id !== routeId)
    );
  };

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
      distance: distance !== '' ? Number(distance) * 1000 : 0, // Convert km to meters for storage
      status,
      note,
      routes,
    };

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
              readOnly={initialData?.routes && initialData.routes.length > 0}
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
              readOnly={initialData?.routes && initialData.routes.length > 0}
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
              sec
            </span>
          </div>
        </div>
      </div>

      {/* Distance Input */}
      <div className="space-y-1">
        <Label className="text-sm">Distance (km)</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={distance}
          placeholder="Distance ran"
          onChange={(e) => setDistance(e.currentTarget.value)}
          className="mt-1 p-2 border rounded-md w-full"
          readOnly={initialData?.routes && initialData.routes.length > 0}
        />
      </div>

      {/* Add Saved Routes Display */}
      {routes.length > 0 && (
        <div className="space-y-1">
          <Label className="text-sm">Saved Routes</Label>
          <SavedRoutesList routes={routes} onDeleteRoute={handleDeleteRoute} />
        </div>
      )}

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
