import { cn } from '@/lib/utils';
import { getActivityIcon } from '@/lib/utils/getActivityIcon';
import { forwardRef } from 'react';

type ActivityBadgeIconProps = {
  activityType: string;
  className?: string;
  iconClassName?: string;
};

const ActivityBadgeIcon = forwardRef<SVGSVGElement, ActivityBadgeIconProps>(
  ({ activityType, className, iconClassName }, ref) => {
    const Icon = getActivityIcon(activityType);
    if (!Icon) return null;

    return (
      <div
        className={cn(
          'size-4 flex items-center justify-center rounded-md bg-emerald-500 text-white',
          className
        )}
      >
        <Icon ref={ref} className={cn('size-3', iconClassName)} />
      </div>
    );
  }
);

ActivityBadgeIcon.displayName = 'ActivityBadgeIcon';

export default ActivityBadgeIcon;
