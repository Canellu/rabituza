import { Button } from '@/components/ui/button';
import { updateActivity } from '@/lib/database/activities/updateActivity';
import useRecordDriving, {
  RecordingStates,
} from '@/lib/hooks/useRecordDriving';
import { getAllLocationsFromDB } from '@/lib/idb/driving';
import { cn } from '@/lib/utils';
import { BaseActivityType, DrivingDataType } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Car, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { GiPauseButton } from 'react-icons/gi';
import ResetDialog from '../ResetDialog';
import SaveDialog from '../SaveDialog';
import DrivingCardHeader from './DrivingCardHeader';
import RecordedSessionList from './RecordedSessionList';

interface RecordingCardProps {
  activity: BaseActivityType & DrivingDataType;
  onExit: () => void;
}

const RecordingCard = ({ onExit, activity }: RecordingCardProps) => {
  const {
    recordingState,
    locations,
    setLocations,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    setRecordingState,
    sessionId,
  } = useRecordDriving();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const queryClient = useQueryClient(); // Initialize query client

  // Set up mutation for updating the activity
  const { mutate } = useMutation({
    mutationFn: async (updatedActivity: BaseActivityType & DrivingDataType) => {
      await updateActivity(activity.userId, activity.id, updatedActivity);
    },
    onSuccess: () => {
      // Invalidate and refetch activities query to ensure UI is up-to-date
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
        return 'Recording';
      case RecordingStates.PAUSED:
        return 'Paused';
      case RecordingStates.STOPPED:
        return 'Stopped';
      case RecordingStates.IDLING:
      default:
        return 'Start Recording';
    }
  };

  const handleConfirmSaveRecording = async () => {
    console.log('Saved recordings');
    setRecordingState(RecordingStates.NOT_STARTED);
    setShowSaveModal(false);

    // Sync local state with IndexedDB
    const allLocations = await getAllLocationsFromDB();

    // Filter locations for the current active sessionId
    const currentSessionLocations = allLocations.filter(
      (location) => location.sessionId === sessionId
    );

    // Create updated activity without routes field
    const { routes: _, ...activityWithoutRoutes } = activity;
    const updatedActivity = {
      ...activityWithoutRoutes,
      routes: [currentSessionLocations], // This will only be used by updateActivity for the subcollection
    };

    mutate(updatedActivity);
    resetRecording();
  };

  const confirmResetRecording = () => {
    console.log('Resetting recordings');
    resetRecording();
    setShowResetModal(false);
  };

  const handleExit = () => {
    if (isRecording || isPaused) {
      stopRecording();
      resetRecording();
    }
    onExit();
  };

  // Determine if there are locations for the current session ID
  const hasCurrentSessionLocations = locations.some(
    (location) => location.sessionId === sessionId
  );

  return (
    <div className={cn('relative p-4', 'flex flex-col gap-3')}>
      <DrivingCardHeader activity={activity} />
      <div className={cn('text-lg font-medium text-center')}>
        <Car className={cn(isRecording && 'animate-bounce', ' mx-auto')} />
        <span className={cn(isRecording && 'animate-pulse')}>
          {getRecordingText()}
        </span>
      </div>
      <div className="items-center flex justify-center gap-4 mb-4">
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
          disabled={isRecording || !hasCurrentSessionLocations}
        >
          <RotateCcw />
        </Button>
      </div>

      <RecordedSessionList locations={locations} sessionId={sessionId || ''} />

      <div className="flex justify-between items-center gap-2 mt-4">
        <Button variant="secondary" size="sm" onClick={handleExit}>
          Exit
        </Button>
        {isStopped && locations.length > 0 && (
          <Button size="sm" onClick={() => setShowSaveModal(true)}>
            Save Current Recording
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
    </div>
  );
};

export default RecordingCard;
