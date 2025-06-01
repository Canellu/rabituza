'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createActivity } from '@/lib/database/activities/createActivity';
import { deleteRoutes } from '@/lib/database/activities/deleteRoutes';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  BaseActivityType,
  SwimmingLocations,
  SwimmingLocationType,
  SwimmingPoolDataType,
  SwimmingRecordingDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityRatings } from '../Activities/ActivityRatings';
import DateTimePicker from '../DateTimePicker';
import PoolSwimmingForm from './PoolSwimmingForm';
import RecordableSwimmingForm from './RecordableSwimmingForm';

interface SwimmingFormProps {
  onClose: () => void;
  initialData?: BaseActivityType &
    (SwimmingPoolDataType | SwimmingRecordingDataType);
}

const SwimmingForm = ({ onClose, initialData }: SwimmingFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState<SwimmingLocationType>(
    initialData?.location || SwimmingLocations.pool
  );

  // Add state for activityDate and ratings in the main form
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

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: (SwimmingPoolDataType | SwimmingRecordingDataType) &
        Pick<BaseActivityType, 'ratings' | 'activityDate'>
    ) => {
      if (!userId) throw new Error('User is not signed in');

      // Check if initialData exists, has an ID, and is a RecordableSwimmingDataType with routes
      if (initialData?.id && 'routes' in initialData && initialData.routes) {
        // Only RecordableSwimmingDataType has routes property
        const currentRouteIds = new Set(
          'routes' in data ? data.routes?.map((r) => r.id) : []
        );
        const deletedRouteIds = initialData.routes
          .filter((r) => r.id && !currentRouteIds.has(r.id))
          .map((r) => r.id!);

        if (deletedRouteIds.length > 0) {
          await deleteRoutes(userId, initialData.id, deletedRouteIds);
        }
      }

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

  // If we're editing an existing activity, don't allow changing the location type
  const isEditing = !!initialData?.id;

  const handleSubmit = (
    formData: SwimmingPoolDataType | SwimmingRecordingDataType
  ) => {
    mutate({
      ...formData,
      activityDate,
      ratings,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      {!isEditing && (
        <div className="space-y-1">
          <Label className="text-sm">Location</Label>
          <Select
            value={location}
            onValueChange={(value: SwimmingLocationType) => setLocation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SwimmingLocations).map(([key, value]) => (
                <SelectItem key={value} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {location === SwimmingLocations.pool ||
      (isEditing && initialData?.location === SwimmingLocations.pool) ? (
        <PoolSwimmingForm
          onSubmit={handleSubmit}
          isPending={isPending}
          initialData={initialData as BaseActivityType & SwimmingPoolDataType}
        />
      ) : (
        <RecordableSwimmingForm
          onSubmit={handleSubmit}
          isPending={isPending}
          location={location}
          initialData={
            initialData as BaseActivityType & SwimmingRecordingDataType
          }
        />
      )}
    </div>
  );
};

export default SwimmingForm;
