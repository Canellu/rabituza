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
import BOULDERING_GYMS from '@/constants/boulderingGyms';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { cn } from '@/lib/utils';
import getGradeColor from '@/lib/utils/getGradeColor';
import { getSession } from '@/lib/utils/userSession';
import { BaseActivityType, ClimbingDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

interface ActivityCardClimbingProps {
  activity: BaseActivityType & ClimbingDataType;
  onEdit?: () => void;
  readOnly?: boolean;
}

const ActivityCardClimbing = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardClimbingProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();
  const Icon = activityOptions.find((opt) => opt.id === activity.type)?.icon;
  const { theme } = useTheme();
  const dark = theme === 'dark';
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
          className={cn(
            'border rounded-xl p-4 space-y-3 bg-white relative dark:border-transparent dark:bg-stone-800'
          )}
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
            <span className="text-sm text-muted-foreground ">
              {activity.activityDate &&
                format(activity.activityDate, 'PP, HH:mm')}
            </span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground capitalize gap-3 items-center">
            <p className="font-medium border px-2 py-1 text-stone-700 text-nowrap rounded-md bg-stone-50 dark:bg-stone-900 dark:text-stone-300 dark:border-transparent">
              {activity.gym}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activity.grades
                .sort((a, b) => {
                  const gymGrades =
                    BOULDERING_GYMS[
                      activity.gym as keyof typeof BOULDERING_GYMS
                    ].grades;
                  return (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    gymGrades.indexOf(a.grade) -
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    gymGrades.indexOf(b.grade)
                  );
                })
                .map((grade, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'size-6 border flex items-center font-bold justify-center rounded-full text-sm',
                      getGradeColor(grade.grade, dark).text,
                      getGradeColor(grade.grade, dark).bg
                    )}
                  >
                    {grade.count}
                  </span>
                ))}
            </div>
          </div>

          {activity.note && (
            <p className="text-sm text-stone-600 line-clamp-5 whitespace-pre-line dark:text-stone-200">
              {activity.note}
            </p>
          )}
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

export default ActivityCardClimbing;
