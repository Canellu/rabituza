import { Button } from '@/components/ui/button';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { deleteEntriesByDate } from '@/lib/idb/driving';
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import {
  calculateTotalRouteDuration,
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
import { toast } from 'sonner';
import DeleteDialog from '../DeleteDialog';
import * as ResizablePanel from '../ResizablePanel';
import Spinner from '../Spinner';
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
  const [loadingPermission, setLoadingPermission] = useState(false);
  const [showCard, setShowCard] = useState<'recording' | 'driving'>('driving');
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
        toast('Local route data deleted successfully');
      } catch (idbError) {
        console.error('Failed to delete local route data:', idbError);
        toast(
          'Failed to delete local route data, but continuing with activity deletion'
        );
        // Continue with activity deletion even if IDB fails
      }

      // Delete the activity from Firestore
      deleteActivityMutation({ userId, activityId: activity.id });
      setShowDeleteDialog(false);
      toast('Activity deleted successfully');
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast('Failed to delete activity. Please try again.');
    }
  };

  const handleExit = () => {
    setShowCard('driving');
  };

  const requestLocationPermission = async () => {
    setLoadingPermission(true); // Set loading state to true
    try {
      // First check if permissions API is available
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        });
        console.log('Permission state:', permission.state);

        if (permission.state === 'denied') {
          toast.error(
            'Location access is blocked. Please enable it in your Browser settings',
            {
              description: 'Settings > Safari > Location',
              duration: 5000,
            }
          );
          return;
        }
      }

      const result = await new Promise((resolve, _reject) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          (error) => {
            console.log('Geolocation error:', error.code, error.message);
            if (error.code === error.PERMISSION_DENIED) {
              toast.error('Please allow location access to record routes', {
                description: 'Check Browser settings if no prompt appears',
                duration: 5000,
              });
            }
            resolve(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      });

      if (result) {
        setShowCard('recording');
      }
    } catch (error) {
      console.error('Error requesting location:', error);
      toast.error('Failed to access location services');
    } finally {
      setLoadingPermission(false); // Reset loading state
    }
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
                          requestLocationPermission();
                        }}
                        disabled={loadingPermission}
                      >
                        {loadingPermission ? (
                          <Spinner color="text-black" />
                        ) : (
                          <MapPin />
                        )}
                        {loadingPermission ? 'Loading...' : 'Record route'}
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
