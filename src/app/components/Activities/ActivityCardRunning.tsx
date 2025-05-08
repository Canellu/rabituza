import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
// Assuming running routes might be stored similarly or not at all in IDB
// import { deleteEntriesByDate } from '@/lib/idb/running'; // Adjust if needed
import { cn } from '@/lib/utils';
import {
  calculateTotalDistance,
  calculateTotalRouteDuration,
  formatDuration,
} from '@/lib/utils/geolocation';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseActivityType,
  DistanceActivitySessionStatuses,
  RunningDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from '../DeleteDialog';
import * as ResizablePanel from '../ResizablePanel';
import ActivityCardHeader from './ActivityCardHeader';
import MapDialog from './MapDialog';
import RecordingCard from './RecordingCard';

interface ActivityCardRunningProps {
  activity: BaseActivityType & RunningDataType;
  onEdit: () => void;
  readOnly?: boolean;
}

const ActivityCardRunning = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardRunningProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCard, setShowCard] = useState<'recording' | 'running' | 'map'>(
    'running'
  );
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

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
    if (userId && activity.id) {
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = async () => {
    if (!userId || !activity.id) return;

    try {
      deleteActivityMutation({ userId, activityId: activity.id });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast('Failed to delete activity. Please try again.');
    }
  };

  const handleExit = () => {
    setShowCard('running');
  };

  // Calculate pace if distance and duration are available
  const pace =
    activity.distance && activity.duration
      ? (activity.duration * 60) / (activity.distance / 1000) // Pace in seconds per km
      : null;

  const formatPace = (paceInSeconds: number | null) => {
    if (paceInSeconds === null) return '-';
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.round(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
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
        <ResizablePanel.Content value="running">
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
                {/* Display Running specific details */}
                {activity.note && (
                  <p className="text-sm text-stone-600 line-clamp-2">
                    {activity.note}
                  </p>
                )}
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Duration */}
                    <p className="px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700 dark:text-stone-400 dark:bg-stone-900  dark:border-stone-800">
                      {formatDuration(
                        calculateTotalRouteDuration(activity.routes)
                      )}
                    </p>
                    {/* Distance */}
                    {activity.distance !== undefined &&
                      activity.distance > 0 && (
                        <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700 dark:text-stone-400 dark:bg-stone-900  dark:border-stone-800">
                          {(activity.distance / 1000).toFixed(2)} km
                        </p>
                      )}
                    {/* Pace */}
                    {pace !== null && (
                      <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700 dark:text-stone-400 dark:bg-stone-900  dark:border-stone-800">
                        {formatPace(pace)}
                      </p>
                    )}
                  </div>

                  {activity.status ===
                    DistanceActivitySessionStatuses.inProgress && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCard('recording');
                      }}
                    >
                      <MapPin /> Record route
                    </Button>
                  )}
                  {activity.routes &&
                    activity.routes.length > 0 &&
                    activity.status ===
                      DistanceActivitySessionStatuses.completed && (
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMapDialogOpen(true);
                        }}
                      >
                        <MapPin />
                      </Button>
                    )}
                </div>

                {/* Route summary section */}
                <div className="bg-stone-100 p-2 rounded-md mt-3 text-sm text-stone-700 dark:bg-stone-900 dark:text-stone-300">
                  {activity.routes && activity.routes.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>
                          {activity.routes.length} route
                          {activity.routes.length > 1 ? 's' : ''} saved
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>
                          Total time:{' '}
                          <span className="tracking-wider">
                            {formatDuration(
                              calculateTotalRouteDuration(activity.routes)
                            )}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>
                          Total distance:{' '}
                          <span className="tracking-wider">
                            {(
                              calculateTotalDistance(activity.routes) / 1000
                            ).toFixed(2)}{' '}
                            km
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-500 dark:text-stone-400">
                      No routes recorded yet
                    </span>
                  )}
                </div>
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
      {activity.routes && activity.routes.length > 0 && (
        <MapDialog
          open={isMapDialogOpen}
          onClose={() => setIsMapDialogOpen(false)}
          activity={activity}
        />
      )}
    </>
  );
};

export default ActivityCardRunning;
