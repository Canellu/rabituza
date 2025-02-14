'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WeatherCondition, WeatherConditions } from '@/types/Activity';

interface WeatherConditionsSelectorProps {
  weatherCondition: WeatherCondition;
  onWeatherConditionChange: (value: WeatherCondition) => void;
}

const WeatherConditionsSelector = ({
  weatherCondition,
  onWeatherConditionChange,
}: WeatherConditionsSelectorProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Weather Conditions</label>
      <Select
        value={weatherCondition}
        onValueChange={(value) =>
          onWeatherConditionChange(value as WeatherCondition)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Weather Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Conditions</SelectLabel>
            {Object.entries(WeatherConditions).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WeatherConditionsSelector;
