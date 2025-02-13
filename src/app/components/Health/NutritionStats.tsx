'use client';

import { NutritionTarget } from '@/types/Nutrition';
import { easeInOut, motion } from 'framer-motion';
import Spinner from '../Spinner';

interface NutritionStatsProps {
  isLoading: boolean;
  nutritionTarget: NutritionTarget | null;
  isInTargetPeriod: boolean;
  selectedDay: Date; // Add this prop
}

const NutritionStats = ({
  isLoading,
  nutritionTarget,
  isInTargetPeriod,
  selectedDay,
}: NutritionStatsProps) => {
  const isTargetDay =
    isInTargetPeriod &&
    nutritionTarget?.daysOfWeek.includes(selectedDay.getDay());

  if (isLoading) {
    return (
      <div className="h-[174px] flex items-center flex-col gap-3 justify-center animate-pulse">
        <Spinner size="size-12" color="text-emerald-800" />
        <span className="text-emerald-800 font-medium">
          Loading nutrition target...
        </span>
      </div>
    );
  }

  if (!nutritionTarget) {
    return (
      <div className="text-emerald-800 text-center text-sm">No target set</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex flex-col gap-6 items-center justify-center"
    >
      <div className="flex">
        <div className="text-center flex flex-col">
          <span className="text-7xl font-semibold text-emerald-800 text-center">
            {isTargetDay ? nutritionTarget.calories : '-'}
          </span>
          <span className="text-emerald-900 text-sm">remaining calories</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full text-stone-700">
        <div className="flex flex-col gap-1 items-center text-center bg-emerald-50 border rounded-lg py-2 px-2">
          <span className="text-xs text-emerald-800">Carbs</span>
          <span className="font-medium text-sm text-emerald-900">
            {isTargetDay ? nutritionTarget.carbs : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-emerald-50 border rounded-lg py-2 px-2">
          <span className="text-xs text-emerald-800">Protein</span>
          <span className="font-medium text-sm text-emerald-900">
            {isTargetDay ? nutritionTarget.protein : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-emerald-50 border rounded-lg py-2 px-2">
          <span className="text-xs text-emerald-800">Fat</span>
          <span className="font-medium text-sm text-emerald-900">
            {isTargetDay ? nutritionTarget.fat : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-emerald-50 border rounded-lg py-2 px-2">
          <span className="text-xs text-emerald-800">Fiber</span>
          <span className="font-medium text-sm text-emerald-900">
            {isTargetDay ? nutritionTarget.fiber : '-'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionStats;
