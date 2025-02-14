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
import formatTrafficCondition from '@/lib/utils/formatTrafficCondition';
import { TrafficCondition, TrafficConditions } from '@/types/Activity';

interface TrafficConditionsSelectorProps {
  trafficCondition: TrafficCondition;
  onTrafficConditionChange: (value: TrafficCondition) => void;
}

const TrafficConditionsSelector = ({
  trafficCondition,
  onTrafficConditionChange,
}: TrafficConditionsSelectorProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">Traffic Conditions</label>
      <Select
        value={trafficCondition}
        onValueChange={(value) =>
          onTrafficConditionChange(value as TrafficCondition)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Traffic Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Conditions</SelectLabel>
            {Object.entries(TrafficConditions).map(([_, value]) => (
              <SelectItem key={value} value={value}>
                {formatTrafficCondition(value)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrafficConditionsSelector;
