import DatePicker from '@/app/components/DatePicker';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SetStateAction } from 'react';
import { NutritionTargetType } from './AddNutritionTarget';

interface TargetOccurrenceProps {
  target: NutritionTargetType;
  setTarget: (value: SetStateAction<NutritionTargetType>) => void;
}

const daysOfWeekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TargetOccurrence = ({ target, setTarget }: TargetOccurrenceProps) => {
  const toggleDay = (dayIndex: number) => {
    setTarget((prev) => {
      const daysOfWeek = prev.daysOfWeek || [];
      if (daysOfWeek.includes(dayIndex)) {
        return {
          ...prev,
          daysOfWeek: daysOfWeek.filter((d) => d !== dayIndex),
        };
      } else {
        return { ...prev, daysOfWeek: [...daysOfWeek, dayIndex] };
      }
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Start Date</Label>
        <DatePicker
          date={target.startDate}
          onDateChange={(date) =>
            setTarget((prev) => ({ ...prev, startDate: date }))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>End Date</Label>
        <DatePicker
          date={target.endDate || undefined}
          onDateChange={(date) =>
            setTarget((prev) => ({ ...prev, endDate: date }))
          }
          disabledDays={{
            before: target.startDate,
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Days of the Week</Label>
        <ToggleGroup
          type="multiple"
          className="flex justify-between bg-stone-50 border rounded-md p-1"
        >
          {daysOfWeekLabels.map((label, index) => (
            <ToggleGroupItem
              key={index}
              value={index.toString()}
              onClick={() => toggleDay(index)}
              data-state={target.daysOfWeek.includes(index) ? 'on' : 'off'} // Set data-state attribute
              className="capitalize w-12 h-8 data-[state=on]:bg-stone-200"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </>
  );
};

export default TargetOccurrence;
