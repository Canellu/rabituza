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
  DrivingDataType,
  DrivingPurpose,
  DrivingPurposes,
  TrafficCondition,
  TrafficConditions,
  WeatherCondition,
  WeatherConditions,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityRatings } from '../Activities/ActivityRatings';
import DateTimePicker from '../DateTimePicker';
import DrivingPurposeSelector from '../DrivingPurposeSelector';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';
import SessionDurationSelector from '../SessionDurationSelector';
import TrafficConditionsSelector from '../TrafficConditionsSelector';
import WeatherConditionsSelector from '../WeatherConditionsSelector';

interface DrivingFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & DrivingDataType;
}

const DrivingForm = ({ onClose, initialData }: DrivingFormProps) => {
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
  const [purpose, setPurpose] = useState<DrivingPurpose>(
    initialData?.purpose || DrivingPurposes.lesson
  );
  const [duration, setDuration] = useState<number | ''>(
    initialData?.duration || 45
  );
  const [weatherConditions, setWeatherConditions] = useState<WeatherCondition>(
    initialData?.weatherConditions || WeatherConditions.sunny
  );
  const [trafficConditions, setTrafficConditions] = useState<TrafficCondition>(
    initialData?.trafficConditions || TrafficConditions.lightTraffic
  );
  const [distance, setDistance] = useState(initialData?.distance || '');
  const [note, setNote] = useState<string>(initialData?.note || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: DrivingDataType & Pick<BaseActivityType, 'ratings' | 'activityDate'>
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
      type: ActivityTypes.Driving,
      activityDate,
      ratings,
      purpose,
      duration: Number(duration),
      weatherConditions,
      trafficConditions,
      distance: distance !== '' ? Number(distance) : 0,
      note,
    };

    mutate(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <DrivingPurposeSelector purpose={purpose} onPurposeChange={setPurpose} />

      <SessionDurationSelector
        duration={duration}
        onDurationChange={setDuration}
        durations={[45, 60, 90, 120]}
      />

      <WeatherConditionsSelector
        weatherCondition={weatherConditions}
        onWeatherConditionChange={setWeatherConditions}
      />

      <TrafficConditionsSelector
        trafficCondition={trafficConditions}
        onTrafficConditionChange={setTrafficConditions}
      />

      <div className="space-y-1">
        <Label className="block text-sm font-medium text-gray-700">
          Distance (km)
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          value={distance}
          placeholder="Distance driven during trip/lesson"
          onChange={(e) => setDistance(e.currentTarget.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </div>

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        onClick={handleSubmit}
        isDisabled={false}
      />
    </div>
  );
};

export default DrivingForm;
