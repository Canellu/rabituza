import { ElementType } from 'react';

interface ActivityCardProps {
  icon: ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  iconColor: string;
  iconBgColor: string;
  compact?: boolean;
}

const ActivityStatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  iconColor,
  iconBgColor,
  compact = false,
}: ActivityCardProps) => {
  return (
    <div
      className={`border rounded-lg bg-white dark:bg-stone-800 dark:border-transparent flex items-center gap-4 ${
        compact ? 'p-2' : 'p-4'
      }`}
    >
      <div
        className={`${compact ? 'p-1.5' : 'p-2'} ${iconBgColor} rounded-full`}
      >
        <Icon className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} ${iconColor}`} />
      </div>
      <div>
        <p
          className={`text-stone-600 dark:text-stone-400 ${
            compact ? 'text-xs' : 'text-sm'
          }`}
        >
          {title}
        </p>
        <p className={`font-semibold ${compact ? 'text-lg' : 'text-2xl'}`}>
          {value}
        </p>
        {subtitle && (
          <p
            className={`text-stone-500 dark:text-stone-400 ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityStatCard;
