import {
  BaseActivityType,
  SwimmingLocations,
  SwimmingPoolDataType,
  SwimmingRecordingDataType,
} from '@/types/Activity';
import ActivityCardSwimmingPool from './ActivityCardSwimmingPool';
import ActivityCardSwimmingRecording from './ActivityCardSwimmingRecording';

interface ActivityCardSwimmingProps {
  activity:
    | (BaseActivityType & SwimmingPoolDataType)
    | (BaseActivityType & SwimmingRecordingDataType);
  onEdit: () => void;
  readOnly?: boolean;
}

const ActivityCardSwimming = ({
  activity,
  onEdit,
  readOnly = false,
}: ActivityCardSwimmingProps) => {
  if (activity.location === SwimmingLocations.pool) {
    return (
      <ActivityCardSwimmingPool
        activity={activity as BaseActivityType & SwimmingPoolDataType}
        onEdit={onEdit}
        readOnly={readOnly}
      />
    );
  }

  return (
    <ActivityCardSwimmingRecording
      activity={activity as BaseActivityType & SwimmingRecordingDataType}
      onEdit={onEdit}
      readOnly={readOnly}
    />
  );
};

export default ActivityCardSwimming;
