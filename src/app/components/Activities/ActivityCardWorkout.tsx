import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import activityOptions from '@/constants/activityOptions';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { BaseActivityType, WorkoutDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActivityCardWorkoutProps {
  activity: BaseActivityType & WorkoutDataType;
  onEdit: () => void;
  readOnly?: boolean;
}

const ActivityCardWorkout = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardWorkoutProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();
  const Icon = activityOptions.find((opt) => opt.id === activity.type)?.icon;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: deleteActivityMutation } = useMutation({
    mutationFn: ({
      userId,
      activityId,
    }: {
      userId: string;
      activityId: string;
    }) => deleteActivity(userId, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
    },
    onError: (error) => {
      console.error('Failed to delete activity:', error);
    },
  });

  const handleDelete = () => {
    if (userId && activity.id) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (userId && activity.id) {
      deleteActivityMutation({ userId, activityId: activity.id });
      setShowDeleteDialog(false);
    }
  };

  const groupedExercises = activity.exercises.reduce((acc, exercise) => {
    const group =
      WORKOUT_EXERCISES[exercise.name as keyof typeof WORKOUT_EXERCISES].group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(exercise);
    return acc;
  }, {} as Record<string, typeof activity.exercises>);

  return (
    <>
      <motion.div
        className={cn('relative', readOnly && 'pointer-events-none touch-none')}
        {...CARD_ANIMATION_CONFIG}
        onClick={onEdit}
      >
        <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4">
          <Trash2 className="text-secondary" />
        </div>
        <motion.div
          className="border rounded-xl p-4 space-y-3 bg-white relative dark:bg-stone-800 dark:border-transparent"
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -250, right: 0 }}
          dragElastic={{ left: 0.5, right: 0 }}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -56 * 3) {
              handleDelete();
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Icon && (
                <Icon className="text-white size-6 rounded-md bg-emerald-500 p-1" />
              )}
              <span className="text-lg font-semibold inter text-stone-700 dark:text-stone-200">
                {activityOptions.find((opt) => opt.id === activity.type)?.label}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {activity.activityDate &&
                format(activity.activityDate, 'PP, HH:mm')}
            </span>
          </div>

          {activity.note && (
            <p className="text-sm text-stone-600 line-clamp-5 whitespace-pre-line dark:text-stone-200">
              {activity.note}
            </p>
          )}

          <div className="space-y-4">
            {Object.entries(groupedExercises).map(([group, exercises]) => (
              <div key={group} className="space-y-2">
                <h3 className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  {group}
                </h3>
                {exercises.map((exercise, index) => (
                  <div key={index} className="space-y-1.5">
                    <span className="font-medium text-stone-700 dark:text-stone-500">
                      {
                        WORKOUT_EXERCISES[
                          exercise.name as keyof typeof WORKOUT_EXERCISES
                        ].name
                      }
                    </span>
                    {exercise.setGroups?.map((setGroup, setIndex) => (
                      <div
                        key={setIndex}
                        className="flex items-center justify-end bg-stone-50 rounded-md p-2 text-sm dark:bg-stone-900"
                      >
                        <div className="flex gap-3 text-stone-600 dark:text-stone-300">
                          <span>
                            {setGroup.sets}{' '}
                            {setGroup.sets === 1 ? 'set' : 'sets'}
                          </span>
                          {'duration' in setGroup ? (
                            <span>{setGroup.duration} sec</span>
                          ) : (
                            <span>
                              {setGroup.reps}{' '}
                              {setGroup.reps === 1 ? 'rep' : 'reps'}
                            </span>
                          )}
                          {typeof setGroup.weight === 'number' && (
                            <span>
                              {setGroup.weight > 0 && '+'}
                              {setGroup.weight.toString()} kg
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {!readOnly && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="max-w-80 rounded-md">
            <DialogHeader>
              <DialogTitle className="text-stone-700">
                Delete Activity
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this activity? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-4 flex-row items-center justify-center">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ActivityCardWorkout;
