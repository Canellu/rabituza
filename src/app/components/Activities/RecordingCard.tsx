import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import useRecordDriving, {
  RecordingStates,
} from '@/lib/hooks/useRecordDriving';
import { getAllLocationsFromDB } from '@/lib/idb/driving';
import { cn } from '@/lib/utils';
import bytesToText from '@/lib/utils/bytesToText';
import { formatTime } from '@/lib/utils/geolocation';
import {
  BaseActivityType,
  DrivingDataType,
  DrivingSessionStatuses,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GiPauseButton } from 'react-icons/gi';
import EndSessionDialog from '../EndSessionDialog';
import ResetDialog from '../ResetDialog';
import SaveDialog from '../SaveDialog';
import Spinner from '../Spinner';
import DrivingCardHeader from './DrivingCardHeader';
import SavedRoutesList from './SavedRoutesList';

interface RecordingCardProps {
  activity: BaseActivityType & DrivingDataType;
  onExit: () => void;
}

const RecordingCard = ({ onExit, activity }: RecordingCardProps) => {
  const {
    recordingState,
    locations,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    dataSize,
  } = useRecordDriving();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (updatedActivity: BaseActivityType & DrivingDataType) => {
      await updateActivity(activity.userId, activity.id, updatedActivity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activities', activity.userId],
      });
      console.log('Activity updated with new route');
    },
    onError: (error) => {
      console.error('Failed to update activity:', error);
    },
  });

  const isRecording = recordingState === RecordingStates.RECORDING;
  const isPaused = recordingState === RecordingStates.PAUSED;
  const isIdle = recordingState === RecordingStates.IDLING;
  const isStopped = recordingState === RecordingStates.STOPPED;

  const getRecordingText = () => {
    switch (recordingState) {
      case RecordingStates.RECORDING: {
        if (locations.length > 0) {
          return 'Recording...';
        } else {
          return (
            <div className="flex items-center justify-center gap-2 text-sm text-stone-700">
              <Spinner size="size-4" color="text-stone-500" />
              <span>Waiting for location data...</span>
            </div>
          );
        }
      }
      case RecordingStates.PAUSED:
        return 'Paused';
      case RecordingStates.STOPPED:
        return 'Stopped';
      case RecordingStates.IDLING:
      default:
        return 'Start recording';
    }
  };

  const handleConfirmSaveRecording = async () => {
    setShowSaveModal(false);

    const allLocations = await getAllLocationsFromDB();
    const { routes: _, ...activityWithoutRoutes } = activity;

    const updatedActivity = {
      ...activityWithoutRoutes,
      routes: [
        {
          id: 'temp', // This will be replaced by Firestore
          createdAt: new Date(), // This will be replaced by Firestore
          geolocations: allLocations,
        },
      ],
    };

    mutate(updatedActivity);
    console.log('Saved recordings');
    resetRecording();
  };

  const confirmResetRecording = () => {
    console.log('Resetting recordings');
    resetRecording();
    setShowResetModal(false);
  };

  const handleConfirmEndSesson = async () => {
    const { routes: existingRoutes, ...activityWithoutRoutes } = activity;

    const updatedActivity = {
      ...activityWithoutRoutes,
      routes: existingRoutes || [],
      status: DrivingSessionStatuses.completed,
    };

    mutate(updatedActivity);
    setShowEndSessionModal(false);
    onExit();
  };

  const handleExit = () => {
    resetRecording();
    onExit();
  };

  useEffect(() => {
    console.log(locations, activity);
  }, [locations, activity]);

  const { value: dataAmount, unit: dataUnit } = bytesToText(dataSize);

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg',
        'flex flex-col gap-3 border-2 border-transparent transition-all duration-500',
        (isRecording || isPaused) && 'border-green-600'
      )}
    >
      <DrivingCardHeader activity={activity} />

      <div className="items-center flex justify-center gap-4 my-4">
        <Button
          onClick={startRecording}
          size="icon"
          variant="secondary"
          disabled={isRecording || isStopped}
        >
          <div className="bg-destructive size-3.5 rounded-full" />
        </Button>
        <Button
          onClick={pauseRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording || isPaused}
        >
          <GiPauseButton className="text-stone-700" />
        </Button>
        <Button
          onClick={stopRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording && !isPaused}
        >
          <div className="bg-destructive size-3.5 rounded-sm" />
        </Button>
        <Button
          onClick={() => setShowResetModal(true)}
          size="icon"
          variant="secondary"
          disabled={isRecording || locations.length === 0 || isIdle}
        >
          <RotateCcw />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 items-center justify-center p-2 text-xs rounded-md border bg-stone-100">
        {locations.map((location) => {
          return (
            <span key={location.timestamp}>
              {new Date(location.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
              ,
            </span>
          );
        })}
      </div>
      <div className="border rounded-md overflow-hidden">
        <div
          className={cn(
            'flex items-center justify-center p-4',
            isRecording &&
              locations.length > 0 &&
              'bg-green-500 text-green-800 font-semibold animate-pulse'
          )}
        >
          {getRecordingText()}
        </div>
        <div className={cn('flex flex-col bg-secondary text-stone-700 ')}>
          {locations.length === 0 && (
            <div className="flex items-center justify-center p-2 italic text-xs border-t">
              <span>No location data recorded</span>
            </div>
          )}
          {locations.length > 0 && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-t">
                <span>
                  {locations.length} point{locations.length > 1 ? 's' : ''}{' '}
                  recorded
                </span>
                <span className="text-end">
                  {dataAmount} {dataUnit}
                </span>
              </div>
              <div className="flex items-center justify-evenly px-4 py-2 border-t ">
                <span>
                  {new Date(locations[0].timestamp).toLocaleTimeString(
                    'en-US',
                    {
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }
                  )}
                </span>
                <span>-</span>
                <span>
                  {formatTime(
                    new Date(locations[locations.length - 1].timestamp)
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-sm">Saved Routes</Label>
        <SavedRoutesList routes={activity.routes} />
      </div>

      <div className="flex justify-between items-center gap-2 mt-4">
        <Button variant="secondary" size="sm" onClick={handleExit}>
          Exit
        </Button>
        {isStopped && locations.length > 0 && (
          <Button size="sm" onClick={() => setShowSaveModal(true)}>
            Save Current Recording
          </Button>
        )}
        {isIdle && activity.routes && activity.routes.length > 0 && (
          <Button size="sm" onClick={() => setShowEndSessionModal(true)}>
            End session
          </Button>
        )}
      </div>

      {/* Reset Dialog */}
      <ResetDialog
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={confirmResetRecording}
      />

      {/* Save Dialog */}
      <SaveDialog
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onConfirm={handleConfirmSaveRecording}
      />

      {/* End Session Dialog */}
      <EndSessionDialog
        open={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        onConfirm={handleConfirmEndSesson}
      />
    </div>
  );
};

export default RecordingCard;
