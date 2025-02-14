import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import activityOptions from '@/constants/activityOptions';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteActivity } from '@/lib/database/activities/deleteActivity';
import { cn } from '@/lib/utils';
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import { getSession } from '@/lib/utils/userSession';
import {
  BaseActivityType,
  DrivingDataType,
  GeoLocation,
} from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Pause, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ActivityCardDrivingProps {
  activity: BaseActivityType & DrivingDataType;
  onEdit: () => void;
}

const RecordingStates = {
  NOT_STARTED: 'not_started',
  IDLE: 'idle',
  RECORDING: 'recording',
  PAUSED: 'paused',
  STOPPED: 'stopped',
};

type RecordingState = (typeof RecordingStates)[keyof typeof RecordingStates];

const ActivityCardDriving = ({
  activity,
  onEdit,
}: ActivityCardDrivingProps) => {
  const queryClient = useQueryClient();
  const userId = getSession();
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingStates.NOT_STARTED
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [locations, setLocations] = useState<GeoLocation[]>([]);

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

  const confirmResetRecording = () => {
    setRecordingState(RecordingStates.IDLE);
    setLocations([]);
    setShowResetModal(false);
  };

  const confirmSaveRecording = () => {
    // Logic to save the recorded session
    setRecordingState(RecordingStates.IDLE);
    setShowSaveModal(false);
  };

  const saveRecording = () => {
    setRecordingState(RecordingStates.IDLE);
    setShowSaveModal(true);
  };

  const startRecording = () => {
    if (
      recordingState === RecordingStates.IDLE ||
      recordingState === RecordingStates.PAUSED
    ) {
      setRecordingState(RecordingStates.RECORDING);
      setLocations([
        {
          latitude: 0,
          longitude: 0,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const pauseRecording = () => {
    if (recordingState === RecordingStates.RECORDING) {
      setRecordingState(RecordingStates.PAUSED);
    }
  };

  const stopRecording = () => {
    if (
      recordingState === RecordingStates.RECORDING ||
      recordingState === RecordingStates.PAUSED
    ) {
      setRecordingState(RecordingStates.STOPPED);
    }
  };

  const resetRecording = () => {
    setShowResetModal(true);
  };

  const getRecordingText = () => {
    switch (recordingState) {
      case RecordingStates.IDLE:
        return 'Start Recording';
      case RecordingStates.RECORDING:
        return 'Recording...';
      case RecordingStates.PAUSED:
        return 'Paused';
      case RecordingStates.STOPPED:
        return 'Stopped';
      default:
        return '';
    }
  };

  return (
    <>
      {recordingState !== RecordingStates.NOT_STARTED && (
        <div
          className={cn(
            'border rounded-xl p-4  bg-white relative',
            'flex flex-col gap-3'
          )}
        >
          <DrivingCardHeader activity={activity} title="Record Driving" />
          <p
            className={cn(
              'text-lg font-medium text-center py-2',
              recordingState === RecordingStates.RECORDING && 'animate-pulse'
            )}
          >
            {getRecordingText()}
          </p>
          <div className="items-center flex justify-center gap-4 mb-4">
            <Button
              onClick={startRecording}
              size="icon"
              variant="secondary"
              disabled={recordingState === RecordingStates.RECORDING}
            >
              <div className="bg-destructive size-3.5 rounded-full" />
            </Button>
            <Button
              onClick={pauseRecording}
              size="icon"
              variant="secondary"
              disabled={recordingState !== RecordingStates.RECORDING}
            >
              <Pause />
            </Button>
            <Button
              onClick={stopRecording}
              size="icon"
              variant="secondary"
              disabled={
                recordingState !== RecordingStates.RECORDING &&
                recordingState !== RecordingStates.PAUSED
              }
            >
              <div className="bg-destructive size-3.5 rounded-sm" />
            </Button>
            <Button
              onClick={resetRecording}
              size="icon"
              variant="secondary"
              disabled={
                recordingState === RecordingStates.IDLE &&
                locations.length === 0
              }
            >
              <RotateCcw />
            </Button>
          </div>

          {locations && locations.length > 0 && (
            <p className={cn('text-sm font-medium text-stone-500 text-center')}>
              Data points: {locations.length}
            </p>
          )}

          <div className="flex justify-between items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRecordingState(RecordingStates.NOT_STARTED)}
            >
              Cancel
            </Button>
            {recordingState === RecordingStates.STOPPED &&
              locations &&
              locations.length > 0 && (
                <Button size="sm" onClick={saveRecording}>
                  Save Recording
                </Button>
              )}
          </div>
        </div>
      )}
      {recordingState === RecordingStates.NOT_STARTED && (
        <motion.div
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
                      setRecordingState(RecordingStates.IDLE);
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

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-80 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-stone-700">
              Delete Activity
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 flex-row items-center justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="max-w-80 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-stone-700">
              Reset Recording
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-1">
              <span>Recorded data will be discarded.</span>
              <span>Are you sure you want to reset the recording?</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 flex-row items-center justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={confirmResetRecording}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent
          className="max-w-80 rounded-md"
          onInteractOutside={(e) => e.preventDefault()}
          hideCloseButton={true}
        >
          <DialogHeader>
            <DialogTitle className="text-stone-700">Save Recording</DialogTitle>
            <DialogDescription>
              Recording stopped, do you want to save the recorded session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 flex-row items-center justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSaveModal(false)}
            >
              Discard
            </Button>
            <Button className="w-full" onClick={confirmSaveRecording}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const DrivingCardHeader = ({
  activity,
  title = 'Driving',
}: {
  activity: BaseActivityType & DrivingDataType;
  title?: string;
}) => {
  const Icon = activityOptions.find((opt) => opt.id === activity.type)?.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="text-white size-6 rounded-md bg-emerald-500 p-1" />
        )}
        <span className="text-lg font-semibold inter text-stone-700">
          {title}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {activity.activityDate && format(activity.activityDate, 'PP, HH:mm')}
      </span>
    </div>
  );
};

export default ActivityCardDriving;
