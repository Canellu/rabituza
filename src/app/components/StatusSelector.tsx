import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DistanceActivitySessionStatus,
  DistanceActivitySessionStatuses,
} from '@/types/Activity';

interface StatusSelector {
  status: DistanceActivitySessionStatus;
  onStatusChange: (status: DistanceActivitySessionStatus) => void;
}

const StatusSelector = ({ status, onStatusChange }: StatusSelector) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm">Session Status</Label>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DistanceActivitySessionStatuses.inProgress}>
            In Progress
          </SelectItem>
          <SelectItem value={DistanceActivitySessionStatuses.completed}>
            Completed
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
