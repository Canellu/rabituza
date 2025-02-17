import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { deleteEntriesByDate } from '@/lib/idb/driving';
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import {
  calculateRouteDuration,
  formatDuration,
} from '@/lib/utils/geolocation';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseActivityType,
  DrivingDataType,
  DrivingSessionStatuses,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DeleteDialog from '../DeleteDialog';
import * as ResizablePanel from '../ResizablePanel';
import DrivingCardHeader from './DrivingCardHeader';
import RecordingCard from './RecordingCard';
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
  const [showCard, setShowCard] = useState<'recording' | 'driving'>('driving');
  const activityOutdated =
    new Date(activity.activityDate).toDateString() !==
    new Date().toDateString();

  const calculateTotalRouteDuration = (
    routes: DrivingDataType['routes'] = []
  ) => {
    return routes.reduce(
      (total, route) => {
        const duration = calculateRouteDuration(route.geolocations);
        const totalSeconds =
          (total.hours || 0) * 3600 +
          total.minutes * 60 +
          total.seconds +
          duration.hours * 3600 +
          duration.minutes * 60 +
          duration.seconds;

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      },
      { hours: 0, minutes: 0, seconds: 0 }
    );
  };

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
    if (userId && activity.id) {
      const activityDate = new Date(activity.activityDate).toLocaleDateString();
      await deleteEntriesByDate(activityDate); // Delete entries by date
      deleteActivityMutation({ userId, activityId: activity.id });
      setShowDeleteDialog(false);
    }
  };

  const handleExit = () => {
    setShowCard('driving');
  };

  return (
    <>
      <ResizablePanel.Root
        value={showCard}
        className="rounded-xl bg-white border"
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
              className="rounded-xl p-4 space-y-3 bg-white relative"
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

              <div className="flex flex-col gap-2 text-sm">
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
                    {activity.distance !== undefined &&
                      activity.distance > 0 && (
                        <p className="capitalize px-2 py-0.5 border flex items-center justify-center rounded-md text-xs bg-stone-50 font-medium text-stone-700">
                          {activity.distance} km
                        </p>
                      )}
                  </div>

                  {!activityOutdated &&
                    activity.status === DrivingSessionStatuses.inProgress && (
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
                  {activity.routes && activity.routes.length > 0 && (
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCard('recording');
                      }}
                      disabled={true}
                    >
                      <MapPin />
                    </Button>
                  )}
                </div>

                <div className="bg-stone-100 p-2 rounded-md mt-3 text-sm text-stone-700">
                  {activity.routes && activity.routes.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span>
                          {activity.routes.length} route
                          {activity.routes.length > 1 ? 's' : ''} saved
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>
                          Total recording time:{' '}
                          {formatDuration(
                            calculateTotalRouteDuration(activity.routes)
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-500">
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
      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ActivityCardDriving;
