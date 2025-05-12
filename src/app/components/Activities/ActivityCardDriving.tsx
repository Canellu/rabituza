import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { deleteEntriesByDate } from '@/lib/idb/activityLocations';
import { cn } from '@/lib/utils';
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import {
  calculateTotalDistance,
  calculateTotalRouteDuration,
  formatDuration,
} from '@/lib/utils/geolocation';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseActivityType,
  DistanceActivitySessionStatuses,
  DrivingDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Map, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from '../DeleteDialog';
import * as ResizablePanel from '../ResizablePanel';
import ActivityCardHeader from './ActivityCardHeader';
import MapDialog from './MapDialog';
import RecordingCard from './RecordingCard';
import SavedRoutesList from './SavedRoutesList';
interface ActivityCardDrivingProps {
  activity: BaseActivityType & DrivingDataType;
  onEdit: () => void;
  readOnly?: boolean;
}

const ActivityCardDriving = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardDrivingProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCard, setShowCard] = useState<'recording' | 'driving' | 'map'>(
    'driving'
  );
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false); // New state for map dialog
  const activityOutdated =
    new Date(activity.activityDate).toDateString() !==
    new Date().toDateString();

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

  const confirmDelete = async () => {
    if (!userId || !activity.id) return;

    try {
      const activityDate = new Date(activity.activityDate).toLocaleDateString();

      // Try to delete IDB entries first
      try {
        await deleteEntriesByDate(activityDate);
      } catch (idbError) {
        console.error('Failed to delete local route data:', idbError);
        // Continue with activity deletion even if IDB fails
      }

      // Delete the activity from Firestore
      deleteActivityMutation({ userId, activityId: activity.id });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast('Failed to delete activity. Please try again.');
    }
  };

  const handleExit = () => {
    setShowCard('driving');
  };

  return (
    <>
      <ResizablePanel.Root
        value={showCard}
        className="rounded-xl bg-white dark:bg-stone-800 dark:border-transparent border"
      >
        <ResizablePanel.Content value="recording">
          <motion.div className="relative">
            <RecordingCard activity={activity} onExit={handleExit} />
          </motion.div>
        </ResizablePanel.Content>
        <ResizablePanel.Content value="driving">
          <motion.div
            className="relative"
            {...CARD_ANIMATION_CONFIG}
            onClick={onEdit}
          >
            <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4">
              <Trash2 className="text-secondary" />
            </div>

            <motion.div
              className={cn(
                'rounded-xl p-4 space-y-3 bg-white relative dark:bg-stone-800 dark:border-transparent'
              )}
              {...(!readOnly && {
                drag: 'x',
                dragDirectionLock: true,
                dragConstraints: { left: -250, right: 0 },
                dragElastic: { left: 0.5, right: 0 },
                dragSnapToOrigin: true,
                onDragEnd: (_, info) => {
                  if (info.offset.x < -56 * 3) {
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
                    {/* Duration */}
                    <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                        Duration
                      </span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {formatDuration(
                          calculateTotalRouteDuration(activity.routes)
                        )}
                      </span>
                    </div>
                    {/* Distance */}
                    <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                        Distance
                      </span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {(
                          calculateTotalDistance(activity.routes || []) / 1000
                        ).toFixed(2)}{' '}
                        km
                      </span>
                    </div>

                    {/* Traffic */}
                    <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                        Traffic
                      </span>
                      <span className="font-medium text-stone-700 dark:text-stone-300 capitalize">
                        {formatTrafficCondition(activity.trafficConditions)}
                      </span>
                    </div>
                  </div>

                  {!readOnly &&
                    activity.status ===
                      DistanceActivitySessionStatuses.inProgress && (
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCard('recording');
                        }}
                      >
                        <MapPin />
                      </Button>
                    )}
                  {activity.routes &&
                    activity.routes.length > 0 &&
                    activity.status ===
                      DistanceActivitySessionStatuses.completed && (
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMapDialogOpen(true);
                        }}
                      >
                        <Map />
                      </Button>
                    )}
                </div>

                {activity.routes && activity.routes.length > 0 && (
                  <SavedRoutesList routes={activity.routes} />
                )}
              </div>
            </motion.div>
          </motion.div>
        </ResizablePanel.Content>
      </ResizablePanel.Root>

      {/* Delete Dialog */}
      {!readOnly && (
        <DeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Map Dialog */}
      <MapDialog
        open={isMapDialogOpen}
        onClose={() => setIsMapDialogOpen(false)}
        activity={activity}
      />
    </>
  );
};

export default ActivityCardDriving;
