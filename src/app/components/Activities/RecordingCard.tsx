import { Button } from '@/components/ui/button';
import useRecordDriving from '@/lib/hooks/useRecordDriving';
import { cn } from '@/lib/utils';
import { Car, Pause, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import ResetDialog from '../ResetDialog';
import SaveDialog from '../SaveDialog';

interface RecordingCardProps {
  onCancel: () => void;
}

const RecordingCard = ({ onCancel }: RecordingCardProps) => {
  const {
    isRecording,
    isPaused,
    locations,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
  } = useRecordDriving();

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const getRecordingText = () => {
    if (isRecording) return 'Recording...';
    if (isPaused) return 'Paused';
    if (!isRecording && !isPaused && locations.length > 0) return 'Stopped';
    return 'Start Recording';
  };

  const handleResetRecording = () => {
    setShowResetModal(true);
  };

  const confirmResetRecording = () => {
    resetRecording();
    setShowResetModal(false);
  };

  const handleSaveRecording = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSaveRecording = () => {
    // Logic to save the recorded session
    setShowSaveModal(false);
  };

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
          onClick={startRecording}
          size="icon"
          variant="secondary"
          disabled={isRecording}
        >
          <div className="bg-destructive size-3.5 rounded-full" />
        </Button>
        <Button
          onClick={pauseRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording || isPaused}
        >
          <Pause />
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
          onClick={handleResetRecording}
          size="icon"
          variant="secondary"
          disabled={!isRecording && !isPaused && locations.length === 0}
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
        {!isRecording && !isPaused && locations.length > 0 && (
          <Button size="sm" onClick={handleSaveRecording}>
            Save Recording
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
