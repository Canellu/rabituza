'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateTotalDistance } from '@/lib/utils/geolocation';
import {
  ActivityTypes,
  BaseActivityType,
  DistanceActivitySessionStatus,
  DistanceActivitySessionStatuses,
  SwimmingLocationType,
  SwimmingRecordingDataType,
} from '@/types/Activity';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import SavedRoutesList from '../Activities/SavedRoutesList';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';
import StatusSelector from '../StatusSelector';

interface RecordableSwimmingFormProps {
  onSubmit: (data: SwimmingRecordingDataType) => void;
  isPending: boolean;
  location: Exclude<SwimmingLocationType, 'pool'>;
  initialData?: BaseActivityType & SwimmingRecordingDataType;
}

const RecordableSwimmingForm = ({
  onSubmit,
  isPending,
  location,
  initialData,
}: RecordableSwimmingFormProps) => {
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
      return Math.floor(totalDurationMs / 1000);
    }
    return undefined;
  };

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

  const [routes, setRoutes] = useState(initialData?.routes || []);

  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialMinutes()
  );
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(
    initialSeconds()
  );
  const [distance, setDistance] = useState(calculateInitialDistance());
  const [note, setNote] = useState<string>(initialData?.note || '');

  const handleDeleteRoute = (routeId: string) => {
    setRoutes((currentRoutes) =>
      currentRoutes.filter((route) => route.id !== routeId)
    );
  };

  const handleNumericChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<number | ''>>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
    } else if (/^\d+$/.test(value)) {
      setter(parseInt(value, 10));
    }
  };

  const handleSubmit = () => {
    const minutes = typeof durationMinutes === 'number' ? durationMinutes : 0;
    const seconds = typeof durationSeconds === 'number' ? durationSeconds : 0;
    const totalDurationSeconds = minutes * 60 + seconds;

    const recordableData: SwimmingRecordingDataType &
      Pick<BaseActivityType, 'note'> = {
      type: ActivityTypes.Swimming,
      duration: totalDurationSeconds >= 0 ? totalDurationSeconds : 0,
      note,
      routes,
      location,
      status,
      distance: distance !== '' ? Number(distance) * 1000 : 0,
    };

    onSubmit(recordableData);
  };

  return (
    <div className="flex flex-col gap-4">
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

      <div className="space-y-1">
        <Label className="text-sm">Distance (km)</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={distance}
          placeholder="Distance swam"
          onChange={(e) => setDistance(e.currentTarget.value)}
          className="mt-1 p-2 border rounded-md w-full"
          readOnly={initialData?.routes && initialData.routes.length > 0}
        />
      </div>

      <StatusSelector status={status} onStatusChange={setStatus} />

      {routes.length > 0 && (
        <div className="space-y-1">
          <Label className="text-sm">Saved Routes</Label>
          <SavedRoutesList routes={routes} onDeleteRoute={handleDeleteRoute} />
        </div>
      )}

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        onClick={handleSubmit}
        isDisabled={false}
      />
    </div>
  );
};

export default RecordableSwimmingForm;
