'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ActivityTypes,
  BaseActivityType,
  SwimmingLocations,
  SwimmingPoolDataType,
  SwimmingStrokeItem,
} from '@/types/Activity';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import LengthSelector from '../LengthSelector';
import NotesInput from '../NotesInput';
import SaveButtonDrawer from '../SaveButtonDrawer';
import SwimmingStrokeSelector from '../SwimmingStrokeSelector';

interface PoolSwimmingFormProps {
  onSubmit: (data: SwimmingPoolDataType) => void;
  isPending: boolean;
  initialData?: BaseActivityType & SwimmingPoolDataType;
}

const PoolSwimmingForm = ({
  onSubmit,
  isPending,
  initialData,
}: PoolSwimmingFormProps) => {
  const [strokes, setStrokes] = useState<SwimmingStrokeItem[]>(
    initialData?.strokes || []
  );
  const [poolLength, setPoolLength] = useState<number | ''>(
    initialData?.poolLength || 25
  );
  const [note, setNote] = useState<string>(initialData?.note || '');

  const calculateInitialDuration = () => {
    if (initialData?.duration !== undefined) {
      return initialData.duration;
    }
    return undefined;
  };

  const initialMinutes = () => {
    const duration = calculateInitialDuration();
    if (duration === undefined) return '';
    return Math.floor(duration / 60);
  };

  const initialSeconds = () => {
    const duration = calculateInitialDuration();
    if (duration === undefined) return '';
    return duration % 60;
  };

  const [durationMinutes, setDurationMinutes] = useState<number | ''>(
    initialMinutes()
  );
  const [durationSeconds, setDurationSeconds] = useState<number | ''>(
    initialSeconds()
  );

  const handleNumericChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: Dispatch<SetStateAction<number | ''>>
  ) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
    } else if (/^\d+$/.test(value)) {
      setter(parseInt(value, 10));
    }
  };

  const handleSubmit = () => {
    const minutes = typeof durationMinutes === 'number' ? durationMinutes : 0;
    const seconds = typeof durationSeconds === 'number' ? durationSeconds : 0;
    const totalDurationSeconds = minutes * 60 + seconds;

    const distance = strokes.reduce((total, stroke) => {
      const sets = parseInt(stroke.sets || '0', 10);
      const laps = parseInt(stroke.laps || '0', 10);
      return total + sets * laps * (poolLength || 0);
    }, 0);

    const poolData: SwimmingPoolDataType & Pick<BaseActivityType, 'note'> = {
      type: ActivityTypes.Swimming,
      duration: totalDurationSeconds >= 0 ? totalDurationSeconds : 0,
      note,
      location: SwimmingLocations.pool,
      poolLength: poolLength !== '' ? poolLength : 0,
      strokes,
      distance,
    };

    onSubmit(poolData);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <Label className="text-sm">Duration</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              value={durationMinutes}
              placeholder="Minutes"
              onChange={(e) => handleNumericChange(e, setDurationMinutes)}
              className="mt-1 p-2 border rounded-md w-full pr-9"
              min="0"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
              min
            </span>
          </div>
          <span>:</span>
          <div className="flex-1 relative">
            <Input
              type="number"
              inputMode="numeric"
              value={durationSeconds}
              placeholder="Seconds"
              onChange={(e) => handleNumericChange(e, setDurationSeconds)}
              className="mt-1 p-2 border rounded-md w-full pr-9"
              min="0"
              max="59"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
              sec
            </span>
          </div>
        </div>
      </div>

      <LengthSelector length={poolLength} onLengthChange={setPoolLength} />

      <SwimmingStrokeSelector strokes={strokes} setStrokes={setStrokes} />

      <NotesInput note={note} onNoteChange={setNote} />

      <SaveButtonDrawer
        isPending={isPending}
        onClick={handleSubmit}
        isDisabled={false}
      />
    </div>
  );
};

export default PoolSwimmingForm;
