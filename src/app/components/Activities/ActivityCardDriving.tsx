import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import { getSession } from '@/lib/utils/userSession';
import { BaseActivityType, DrivingDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import DrivingCardHeader from './DrivingCardHeader'; // Import the new component
import RecordingCard from './RecordingCard'; // Import the new component

interface ActivityCardDrivingProps {
  activity: BaseActivityType & DrivingDataType;
  onEdit: () => void;
}

const ActivityCardDriving = ({
  activity,
  onEdit,
}: ActivityCardDrivingProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRecordingCard, setShowRecordingCard] = useState(false);

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

  const handleCancel = () => {
    setShowRecordingCard(false);
  };

  return (
    <>
      {showRecordingCard ? (
        <motion.div layoutId="activity-card" className="relative">
          <RecordingCard onCancel={handleCancel} />
        </motion.div>
      ) : (
        <motion.div
          layoutId="activity-card"
          className="relative"
          {...CARD_ANIMATION_CONFIG}
          onClick={onEdit}
        >
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
            <DrivingCardHeader activity={activity} />

            <div className="space-y-2 text-sm">
              <p className="font-medium border px-2 py-1 text-stone-700 text-nowrap rounded-md bg-stone-50 first-letter:capitalize max-w-max">
                {activity.purpose}
              </p>

              {activity.note && (
                <p className="text-sm text-stone-600 line-clamp-2">
                  {activity.note}
                </p>
              )}
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-1 flex-wrap">
                  <p className="px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700">
                    {activity.duration} min
                  </p>
                  <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700">
                    {activity.weatherConditions}
                  </p>
                  <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700">
                    {formatTrafficCondition(activity.trafficConditions)}
                  </p>
                  {activity.distance !== undefined && activity.distance > 0 && (
                    <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700">
                      {activity.distance} km
                    </p>
                  )}
                </div>

                {activity.route && activity.route.length === 0 && (
                  <Button
                    size="sm"
                    className="bg-emerald-500 rounded-full text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecordingCard(true);
                    }}
                  >
                    <span className="font-bold">Record route</span>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ActivityCardDriving;
