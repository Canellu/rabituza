import { Input } from '@/components/ui/input';
import type { NutritionTarget } from '@/types/Nutrition';
import { SetStateAction, useState } from 'react';

type TargetType = Pick<
  NutritionTarget,
  'isRecurring' | 'startDate' | 'isCheatDay'
> & {
  endDate?: Date;
};

interface TargetOccurrenceProps {
  target: TargetType;
  setTarget: (value: SetStateAction<TargetType>) => void;
}

const TargetOccurrence = ({ target, setTarget }: TargetOccurrenceProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          defaultValue={startDate}
          onChange={(e) => setStartDate(e.currentTarget.value)}
        />

        <Input
          type="date"
          defaultValue={endDate}
          onChange={(e) => setEndDate(e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default TargetOccurrence;
