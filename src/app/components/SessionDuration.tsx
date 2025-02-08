import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SessionDurationProps {
  duration: number | '';
  onDurationChange: (value: number | '') => void;
}

const DEFAULT_DURATIONS = [10, 15, 20, 25, 30, 35];

const SessionDuration: React.FC<SessionDurationProps> = ({
  duration,
  onDurationChange,
}) => {
  const handleDurationToggle = (value: string) => {
    onDurationChange(value ? parseInt(value) : '');
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Label htmlFor="duration">Session Duration</Label>
      <div className="flex gap-2">
        <ToggleGroup
          type="single"
          value={duration ? duration.toString() : ''}
          onValueChange={handleDurationToggle}
          className="flex bg-stone-50 border rounded-md p-1 grow"
        >
          {DEFAULT_DURATIONS.map((time) => (
            <ToggleGroupItem
              key={time}
              value={time.toString()}
              className="data-[state=on]:bg-stone-200 h-7"
            >
              {time}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="relative w-20">
          <Input
            id="duration"
            type="number"
            placeholder="X"
            min={0}
            value={duration}
            onChange={(e) =>
              onDurationChange(e.target.value ? parseInt(e.target.value) : '')
            }
            className="pr-8"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            min
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionDuration;
