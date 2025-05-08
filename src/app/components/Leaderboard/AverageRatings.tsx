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
      'border rounded-lg bg-white dark:bg-stone-800 dark:border-transparent',
      'flex items-center gap-2 p-2 flex-col justify-center text-center'
    )}
  >
    <div className="bg-emerald-100 dark:bg-emerald-900 p-1.5 rounded-full">
      <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    </div>
    <div>
      <p className="text-stone-600 dark:text-stone-400 text-xs">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
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
