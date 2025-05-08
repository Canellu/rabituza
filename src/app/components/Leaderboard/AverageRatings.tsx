import { cn } from '@/lib/utils';
import { Battery, Flame, LucideIcon, Smile } from 'lucide-react';

interface Statistics {
  totalActivities: number;
  averageIntensity: string;
  averageEnjoyment: string;
  averageEnergy: string;
}

interface StatBoxProps {
  Icon: LucideIcon;
  value: string;
  label: string;
}

const StatBox = ({ Icon, value, label }: StatBoxProps) => (
  <div
    className={cn(
      'border aspect-square rounded-xl dark:border-stone-800 ',
      'flex-col flex items-center justify-center gap-1'
    )}
  >
    <Icon className="size-6 text-primary" />
    <span className="text-emerald-700 font-semibold inter text-xl">
      {value}
    </span>
    <span className="text-xs text-stone-600">{label}</span>
  </div>
);

interface AverageRatingsProps {
  statistics: Statistics;
}

const AverageRatings = ({ statistics }: AverageRatingsProps) => {
  return (
    <div className="flex flex-col items-start gap-2 justify-between">
      <span className="text-lg font-medium">Average ratings</span>
      <div className="grid grid-cols-3 gap-2 items-center justify-center w-full">
        <StatBox
          Icon={Flame}
          value={statistics.averageIntensity}
          label="Intensity"
        />
        <StatBox
          Icon={Battery}
          value={statistics.averageEnergy}
          label="Energy"
        />
        <StatBox
          Icon={Smile}
          value={statistics.averageEnjoyment}
          label="Enjoyment"
        />
      </div>
    </div>
  );
};

export default AverageRatings;
