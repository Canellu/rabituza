import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/time';
import { getSession } from '@/lib/utils/userSession';
import { BaseActivityType, SwimmingPoolDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2, WavesLadder } from 'lucide-react';
import { ReactNode, useMemo, useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from '../DeleteDialog';
import StrokeLine from '../StrokeLine';
import ActivityCardHeader from './ActivityCardHeader';

interface ActivityCardSwimmingPoolProps {
  activity: BaseActivityType & SwimmingPoolDataType;
  onEdit: () => void;
  readOnly?: boolean;
}

const DRAG_DELETE_THRESHOLD = -168;

const StatBadge = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
    <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
      {label}
    </span>
    <span className="font-medium text-stone-700 dark:text-stone-300">
      {children}
    </span>
  </div>
);

const getTotalLaps = (activity: SwimmingPoolDataType) => {
  if (!activity.strokes) return 0;
  return activity.strokes.reduce((total, stroke) => {
    const sets = parseInt(stroke.sets || '0', 10);
    const laps = parseInt(stroke.laps || '0', 10);
    return total + sets * laps;
  }, 0);
};

const getDistanceMeters = (activity: SwimmingPoolDataType) => {
  if (activity.distance !== undefined && activity.distance > 0) {
    return activity.distance;
  }
  const totalLaps = getTotalLaps(activity);
  return totalLaps * activity.poolLength;
};

const ActivityCardSwimmingPool = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardSwimmingPoolProps) => {
  const queryClient = useQueryClient();
  const userId = useMemo(() => getSession(), []);
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
      toast('Failed to delete activity. Please try again.');
    },
  });

  const handleDelete = () => {
    if (userId && activity?.id) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    if (!userId || !activity?.id) return;
    deleteActivityMutation({ userId, activityId: activity.id });
    setShowDeleteDialog(false);
  };

  const totalLaps = getTotalLaps(activity);
  const distanceMeters = getDistanceMeters(activity);

  return (
    <>
      <motion.div
        className="relative"
        {...CARD_ANIMATION_CONFIG}
        onClick={onEdit}
      >
        <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4 pointer-events-none">
          <Trash2 className="text-secondary" />
        </div>

        <motion.div
          className={cn(
            'rounded-xl p-4 space-y-3 border bg-white relative dark:bg-stone-800 dark:border-transparent'
          )}
          {...(!readOnly && {
            drag: 'x',
            dragDirectionLock: true,
            dragConstraints: { left: -250, right: 0 },
            dragElastic: { left: 0.5, right: 0 },
            dragSnapToOrigin: true,
            onDragEnd: (_, info) => {
              if (info.offset.x < DRAG_DELETE_THRESHOLD) {
                handleDelete();
              }
            },
          })}
        >
          <ActivityCardHeader activity={activity} />

          <div className="flex flex-col gap-2 text-sm">
            {activity.note && (
              <p className="text-sm text-stone-600 line-clamp-2 dark:text-stone-300">
                {activity.note}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 shrink-0">
                <StatBadge label="Location">
                  <span className="flex items-center gap-1">
                    <WavesLadder className="w-3 h-3" /> Pool
                  </span>
                </StatBadge>

                {activity.duration > 0 && (
                  <StatBadge label="Duration">
                    {formatDuration(activity.duration)}
                  </StatBadge>
                )}

                {distanceMeters > 0 && (
                  <StatBadge label="Distance">{distanceMeters}m</StatBadge>
                )}

                {totalLaps > 0 && (
                  <StatBadge label="Laps">{totalLaps}</StatBadge>
                )}
              </div>
            </div>

            {/* Show each stroke/drill details */}
            {activity.strokes?.length > 0 && (
              <div className="mt-2 space-y-1">
                {activity.strokes.map((stroke, idx) => (
                  <StrokeLine key={idx} stroke={stroke} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {!readOnly && (
        <DeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default ActivityCardSwimmingPool;
