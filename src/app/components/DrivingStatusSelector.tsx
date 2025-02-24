import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DrivingSessionStatus, DrivingSessionStatuses } from '@/types/Activity';

interface DrivingStatusSelectorProps {
  status: DrivingSessionStatus;
  onStatusChange: (status: DrivingSessionStatus) => void;
}

const DrivingStatusSelector = ({
  status,
  onStatusChange,
}: DrivingStatusSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label className="text-sm">Session Status</Label>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DrivingSessionStatuses.inProgress}>
            In Progress
          </SelectItem>
          <SelectItem value={DrivingSessionStatuses.completed}>
            Completed
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DrivingStatusSelector;
