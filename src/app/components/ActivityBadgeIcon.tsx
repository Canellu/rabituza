import { cn } from '@/lib/utils';
import { getActivityIcon } from '@/lib/utils/getActivityIcon';

type ActivityBadgeIconProps = {
  activityType: string;
  className?: string;
  iconClassName?: string;
};

const ActivityBadgeIcon = ({
  activityType,
  className,
  iconClassName,
}: ActivityBadgeIconProps) => {
  const Icon = getActivityIcon(activityType);
  if (!Icon) return null;

  return (
    <div
      className={cn(
        'size-4 flex items-center justify-center rounded-md bg-emerald-500 text-white',
        className
      )}
    >
      <Icon className={cn('size-3', iconClassName)} />
    </div>
  );
};

export default ActivityBadgeIcon;
