'use client';

import { createActivity } from '@/lib/database/activities/createActivity';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import { getSession } from '@/lib/utils/userSession';
import {
  ActivityRatingsType,
  ActivityTypes,
  BaseActivityType,
  HangboardDataType,
  HangboardEdgeType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityRatings } from '../Activities/ActivityRatings';
import DateTimePicker from '../DateTimePicker';
import EdgeSelector from '../EdgeSelector';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';

interface HangboardFormProps {
  onClose: () => void;
  initialData?: BaseActivityType & HangboardDataType;
}

const HangboardForm = ({ onClose, initialData }: HangboardFormProps) => {
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

  const [edges, setEdges] = useState<HangboardEdgeType[]>(
    initialData?.edges?.length
      ? initialData.edges.map((edge) => ({
          size: edge.size,
          sets: edge.sets,
          reps: edge.reps,
          weight: edge.weight,
          duration: edge.duration,
        }))
      : []
  );

  const [note, setNote] = useState<string>(initialData?.note || '');

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      data: HangboardDataType &
        Pick<BaseActivityType, 'ratings' | 'activityDate'>
    ) => {
      if (!userId) throw new Error('User is not signed in');
      if (initialData?.id) {
        return updateActivity(userId, initialData.id, data); // Update if ID exists
      } else {
        return createActivity(userId, data); // Create if no ID
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
      type: ActivityTypes.Hangboard,
      activityDate,
      ratings,
      edges: edges.map((edge) => ({
        size: edge.size,
        sets: Number(edge.sets),
        reps: Number(edge.reps),
        weight: Number(edge.weight),
        duration: Number(edge.duration),
      })),
      note,
    };

    mutate(data);
  };

  // Check if any edge has invalid sets or reps (not a number or less than or equal to zero)
  const hasInvalidSetsOrReps = edges.some(
    (edge) =>
      typeof edge.sets !== 'number' ||
      edge.sets <= 0 ||
      typeof edge.reps !== 'number' ||
      edge.reps <= 0 ||
      typeof edge.duration !== 'number' ||
      edge.duration <= 0
  );

  return (
    <div className="flex flex-col gap-4">
      <DateTimePicker date={activityDate} onDateChange={setActivityDate} />
      <ActivityRatings ratings={ratings} onChange={setRatings} />

      <EdgeSelector edges={edges} setEdges={setEdges} />

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        isDisabled={hasInvalidSetsOrReps || edges.length === 0} // Disable if edges are empty or any edge has invalid sets or reps
        onClick={handleSubmit}
      />
    </div>
  );
};

export default HangboardForm;
