import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LengthSelectorProps {
  length: number | '';
  onLengthChange: (value: number | '') => void;
  lengths?: number[];
}

const DEFAULT_LENGTHS = [25, 50];

const LengthSelector = ({
  length,
  onLengthChange,
  lengths = DEFAULT_LENGTHS,
}: LengthSelectorProps) => {
  const handleLengthToggle = (value: string) => {
    onLengthChange(value ? parseInt(value) : '');
  };

  return (
    <div className="space-y-1 mt-2">
      <Label htmlFor="length" className="text-sm">
        Pool Length
      </Label>
      <div className="flex gap-2 ">
        <ToggleGroup
          type="single"
          value={length ? length.toString() : ''}
          onValueChange={handleLengthToggle}
          className="flex bg-stone-50 border dark:border-transparent dark:bg-stone-900 rounded-md p-1 grow"
        >
          {lengths.map((length) => (
            <ToggleGroupItem
              key={length}
              value={length.toString()}
              className="data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-700 h-7 w-full"
            >
              {length}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="relative w-[82px]">
          <Input
            id="length"
            type="number"
            placeholder="X"
            min={0}
            maxLength={3}
            value={length}
            onChange={(e) =>
              onLengthChange(e.target.value ? parseInt(e.target.value) : '')
            }
            className="pr-9"
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 mt-px">
            m
          </span>
        </div>
      </div>
    </div>
  );
};

export default LengthSelector;
