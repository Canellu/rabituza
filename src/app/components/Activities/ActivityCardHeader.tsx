import activityOptions from '@/constants/activityOptions';
import {
  BaseActivityType,
  DrivingDataType,
  RunningDataType,
} from '@/types/Activity';
import { format } from 'date-fns';

interface ActivityCardHeaderProps {
  activity:
    | (BaseActivityType & DrivingDataType)
    | (BaseActivityType & RunningDataType);
  title?: string;
}

const ActivityCardHeader = ({ activity, title }: ActivityCardHeaderProps) => {
  const Icon = activityOptions.find((opt) => opt.id === activity.type)?.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="text-white size-6 rounded-md bg-emerald-500 p-1" />
        )}
        <span className="text-lg font-semibold inter text-stone-700 dark:text-stone-200">
          {title}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {activity.activityDate && format(activity.activityDate, 'PP, HH:mm')}
      </span>
    </div>
  );
};

export default ActivityCardHeader;
