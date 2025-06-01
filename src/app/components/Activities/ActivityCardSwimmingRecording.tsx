import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/time';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseActivityType,
  DistanceActivitySessionStatuses,
  SwimmingRecordingDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Map, MapPin, Trash2, Waves } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteDialog from '../DeleteDialog';
import * as ResizablePanel from '../ResizablePanel';
import ActivityCardHeader from './ActivityCardHeader';
import MapDialog from './MapDialog';
import RecordingCard from './RecordingCard';
import SavedRoutesList from './SavedRoutesList';

interface ActivityCardSwimmingRecordingProps {
  activity: BaseActivityType & SwimmingRecordingDataType;
  onEdit: () => void;
  readOnly?: boolean;
}

const ActivityCardSwimmingRecording = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardSwimmingRecordingProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCard, setShowCard] = useState<'recording' | 'swimming'>(
    'swimming'
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
    setShowCard('swimming');
  };

  const pace =
    activity.distance && activity.duration
      ? activity.duration / (activity.distance / 1000)
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
        <ResizablePanel.Content value="swimming">
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
                    <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                        Location
                      </span>
                      <span className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1 capitalize">
                        <Waves className="w-3 h-3" />
                        {activity.location ?? 'Unknown'}
                      </span>
                    </div>

                    <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                        Duration
                      </span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">
                        {formatDuration(activity.duration)}
                      </span>
                    </div>

                    {activity.distance !== undefined &&
                      activity.distance > 0 && (
                        <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                          <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                            Distance
                          </span>
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            {(activity.distance / 1000).toFixed(2)} km
                          </span>
                        </div>
                      )}

                    {pace !== null && (
                      <div className="px-2 py-1 border flex flex-col items-center justify-center rounded-md text-xs bg-stone-50 dark:bg-stone-900 dark:border-stone-800">
                        <span className="text-stone-500 dark:text-stone-400 text-[10px] mb-0.5">
                          Pace
                        </span>
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {formatPace(pace)}
                        </span>
                      </div>
                    )}
                  </div>

                  {activity.status ===
                  DistanceActivitySessionStatuses.inProgress ? (
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCard('recording');
                      }}
                    >
                      <MapPin />
                    </Button>
                  ) : (
                    activity.routes &&
                    activity.routes.length > 0 && (
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
                    )
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

      {!readOnly && (
        <DeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
        />
      )}

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

export default ActivityCardSwimmingRecording;
