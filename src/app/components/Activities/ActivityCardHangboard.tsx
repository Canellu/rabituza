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
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { getSession } from '@/lib/utils/userSession';
import { BaseActivityType, HangboardDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActivityCardHangboardProps {
  activity: BaseActivityType & HangboardDataType;
  onEdit: () => void;
}

const ActivityCardHangboard = ({
  activity,
  onEdit,
}: ActivityCardHangboardProps) => {
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
      <motion.div className="relative" onClick={onEdit}>
        <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4">
          <Trash2 className="text-secondary" />
        </div>
        <motion.div
          className="border rounded-xl p-4 space-y-3 bg-white relative"
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
              <span className="text-lg font-semibold inter text-stone-700">
                {activityOptions.find((opt) => opt.id === activity.type)?.label}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {activity.activityDate &&
                format(activity.activityDate, 'PP, HH:mm')}
            </span>
          </div>

          {activity.note && (
            <p className="text-sm text-stone-600 line-clamp-2">
              {activity.note}
            </p>
          )}
          <div className="space-y-2">
            {activity.edges.map((edge, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-stone-50 rounded-md p-2 text-sm"
              >
                <span className="font-medium text-stone-700">
                  {edge.size} mm
                </span>
                <div className="flex gap-3 text-stone-600">
                  <span>
                    {edge.sets} {edge.sets === 1 ? 'set' : 'sets'}
                  </span>
                  <span>
                    {edge.reps} {edge.reps === 1 ? 'rep' : 'reps'}
                  </span>
                  {edge.weight > 0 && <span>+{edge.weight}kg</span>}
                  <span>{edge.duration}s</span>
                </div>
              </div>
            ))}
          </div>
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

export default ActivityCardHangboard;
