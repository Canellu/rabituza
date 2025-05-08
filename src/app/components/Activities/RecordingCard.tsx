import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Import Label from shadcn
import { Switch } from '@/components/ui/switch'; // Import Switch from shadcn
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; // Import ToggleGroup components
import { updateActivity } from '@/lib/database/activities/updateActivity';
import useRecordGeolocation, {
  RecordingStates,
} from '@/lib/hooks/useRecordGeolocation';
import { getAllLocationsFromDB } from '@/lib/idb/activityLocations';
import { cn } from '@/lib/utils';
import bytesToText from '@/lib/utils/bytesToText';
import { formatTime } from '@/lib/utils/time';
import {
  BaseActivityType,
  DistanceActivitySessionStatuses,
  DrivingDataType,
  RunningDataType,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Crosshair, Gauge, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { GiPauseButton } from 'react-icons/gi';
import EndSessionDialog from '../EndSessionDialog';
import ResetDialog from '../ResetDialog';
import SaveDialog from '../SaveDialog';
import Spinner from '../Spinner';
import ActivityCardHeader from './ActivityCardHeader';
import SavedRoutesList from './SavedRoutesList';

interface RecordingCardProps {
  activity:
    | (BaseActivityType & DrivingDataType)
    | (BaseActivityType & RunningDataType);
  onExit: () => void;
}

const RecordingCard = ({ onExit, activity }: RecordingCardProps) => {
  const {
    recordingState,
    locations,
    dataSize,
    currentSpeed,
    currentAccuracy,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    isResetting,
    isStartingRecording,
    minInterval,
    setMinInterval,
    isIntervalEnabled,
    setIsIntervalEnabled,
  } = useRecordGeolocation();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (
      updatedActivity:
        | (BaseActivityType & DrivingDataType)
        | (BaseActivityType & RunningDataType)
    ) => {
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
      case RecordingStates.RECORDING:
        return 'Recording...';
      case RecordingStates.PAUSED:
        return 'Paused';
      case RecordingStates.STOPPED:
        return 'Stopped';
      case RecordingStates.IDLING: {
        if (isStartingRecording) return '';
        return 'Start recording';
      }

      default:
        return '';
    }
  };

  const handleConfirmSaveRecording = async () => {
    setShowSaveModal(false);

    const allLocations = await getAllLocationsFromDB();

    // Don't save if there are no locations
    if (!allLocations || allLocations.length === 0) {
      console.log('No locations to save');
      return;
    }

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
    const { routes: _, ...activityWithoutRoutes } = activity;

    const updatedActivity = {
      ...activityWithoutRoutes,
      status: DistanceActivitySessionStatuses.completed,
    };

    mutate(updatedActivity);
    setShowEndSessionModal(false);
    onExit();
  };

  const handleExit = () => {
    resetRecording();
    onExit();
  };

  const { value: dataAmount, unit: dataUnit } = bytesToText(dataSize);

  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-white dark:bg-stone-800',
        'flex flex-col gap-3 border-2 border-transparent transition-all duration-500',
        (isRecording || isPaused) && 'border-green-600'
      )}
    >
      <ActivityCardHeader activity={activity} />

      <div className="flex items-center justify-between gap-2">
        <ToggleGroup
          type="single"
          value={minInterval.toString()}
          onValueChange={(value) => setMinInterval(Number(value))}
          className="flex flex-grow justify-evenly gap-1 border bg-stone-50 rounded-md p-1 dark:bg-stone-700"
        >
          {['500', '1000', '2000', '3000', '5000'].map((interval) => (
            <ToggleGroupItem
              key={interval}
              value={interval}
              className="data-[state=on]:bg-stone-200 px-2 py-1 h-8 flex-grow"
              disabled={!isIntervalEnabled}
            >
              {Number(interval) >= 1000
                ? (Number(interval) / 1000).toFixed(0)
                : (Number(interval) / 1000).toFixed(1)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Switch
          checked={isIntervalEnabled}
          onCheckedChange={(checked) => setIsIntervalEnabled(checked)}
        />
      </div>

      <div className="items-center flex justify-center gap-4 my-4">
        <Button
          onClick={startRecording}
          size="icon"
          variant="secondary"
          disabled={isStartingRecording || isRecording || isStopped}
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
          disabled={
            isResetting || isRecording || locations.length === 0 || isIdle
          }
        >
          <RotateCcw />
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden dark:border-stone-700">
        <div
          className={cn(
            'flex items-center justify-center p-4',

            isRecording &&
              locations.length > 0 &&
              'bg-green-500 text-green-800 font-semibold '
          )}
        >
          {isStartingRecording && (
            <div className="flex items-center justify-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <Spinner size="size-4" color="text-stone-700" />
              <span>Initializing...</span>
            </div>
          )}
          <span
            className={cn(
              (isStartingRecording || isRecording) && 'animate-pulse'
            )}
          >
            {getRecordingText()}
          </span>
        </div>
        <div
          className={cn(
            'flex flex-col bg-secondary text-stone-700 dark:text-stone-300'
          )}
        >
          {locations.length === 0 && (
            <div className="flex items-center justify-center p-2 italic text-xs border-t dark:border-t-stone-600">
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
              <div className="flex items-center justify-around px-4 py-2 border-t ">
                <span>{formatTime(new Date(locations[0].timestamp))}</span>
                <span>-</span>
                <span>
                  {formatTime(
                    new Date(locations[locations.length - 1].timestamp)
                  )}
                </span>
              </div>
              <div className="px-4 py-2 border-t flex items-center justify-between">
                <div className="flex items-center justify-center gap-2">
                  <Crosshair className="size-5" /> {currentAccuracy.toFixed(1)}m
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Gauge className="size-5" /> {(currentSpeed * 3.6).toFixed(1)}{' '}
                  km/h
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {activity.routes && activity.routes.length > 0 && (
        <div className="space-y-1">
          <Label className="text-sm">Saved Routes</Label>
          <SavedRoutesList routes={activity.routes} />
        </div>
      )}

      <div className="flex justify-between items-center gap-2 mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExit}
          disabled={isResetting || isStartingRecording}
        >
          Exit
        </Button>
        {isStopped && locations.length > 0 && (
          <Button
            size="sm"
            onClick={() => setShowSaveModal(true)}
            disabled={isResetting || isStartingRecording}
          >
            Save Current Recording
          </Button>
        )}
        {isIdle && activity.routes && activity.routes.length > 0 && (
          <Button
            size="sm"
            onClick={() => setShowEndSessionModal(true)}
            disabled={isResetting || isStartingRecording}
          >
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
