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
import { useState } from 'react';

interface ActivityCardClimbingProps {
  activity: BaseActivityType & ClimbingDataType;
}

const ActivityCardClimbing = ({ activity }: ActivityCardClimbingProps) => {
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

  return (
    <>
      <motion.div
        className="relative"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-1 bg-red-500 rounded-lg flex items-center justify-end px-4">
          <Trash2 className="text-secondary" />
        </div>
        <motion.div
          className="border rounded-lg p-4 shadow-sm space-y-3 bg-secondary relative"
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
                <Icon className="text-lime-500 size-7 rounded-md bg-gradient-to-br from-stone-50 to-stone-100 border p-1" />
              )}
              <span className="text-lg font-semibold inter text-stone-700">
                {activityOptions.find((opt) => opt.id === activity.type)?.label}
              </span>
            </div>
            <span className="text-sm text-muted-foreground ">
              {activity.activityDate &&
                format(activity.activityDate, 'PP, HH:mm')}
            </span>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground capitalize gap-3 items-center">
            <p className="text-base font-medium border border-stone-200/70 px-3 py-0.5 bg-stone-50 max-w-max rounded-full flex items-center gap-1">
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
                      getGradeColor(grade.grade).text,
                      getGradeColor(grade.grade).bg
                    )}
                  >
                    {grade.count}
                  </span>
                ))}
            </div>
          </div>

          {activity.note && (
            <p className="text-sm text-stone-500 line-clamp-1">
              {activity.note}
            </p>
          )}
        </motion.div>
      </motion.div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-80 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-stone-700">
              Delete Activity
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot
              be undone.
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
    </>
  );
};

export default ActivityCardClimbing;
