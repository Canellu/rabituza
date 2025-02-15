import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GeoLocation } from '@/types/Activity';
import { Car, Pause, RotateCcw } from 'lucide-react';

interface RecordingCardProps {
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isIdle: boolean;
  locations: GeoLocation[];
  getRecordingText: () => string;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onCancel: () => void;
  onSaveRecording: () => void;
}

const RecordingCard = ({
  isRecording,
  isPaused,
  isStopped,
  isIdle,
  locations,
  getRecordingText,
  onStartRecording,
  onPauseRecording,
  onStopRecording,
  onResetRecording,
  onCancel,
  onSaveRecording,
}: RecordingCardProps) => {
  return (
    <div
      className={cn(
        'border rounded-xl p-4  bg-white relative',
        'flex flex-col gap-3'
      )}
    >
      <div className={cn('text-lg font-medium text-center')}>
        <Car className={cn(isRecording && 'animate-bounce', ' mx-auto')} />
        <span className={cn(isRecording && 'animate-pulse')}>
          {getRecordingText()}
        </span>
      </div>
      <div className="items-center flex justify-center gap-4 mb-4">
        <Button
          onClick={onStartRecording}
          size="icon"
          variant="secondary"
          disabled={isRecording || isStopped}
        >
          <div className="bg-destructive size-3.5 rounded-full" />
        </Button>
        <Button
          onClick={onPauseRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording}
        >
          <Pause />
        </Button>
        <Button
          onClick={onStopRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording && !isPaused}
        >
          <div className="bg-destructive size-3.5 rounded-sm" />
        </Button>
        <Button
          onClick={onResetRecording}
          size="icon"
          variant="secondary"
          disabled={isIdle && locations.length === 0}
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
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        {isStopped && locations && locations.length > 0 && (
          <Button size="sm" onClick={onSaveRecording}>
            Save Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordingCard;
