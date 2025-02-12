'use client';

import { NutritionTarget } from '@/types/Nutrition';
import { easeInOut, motion } from 'framer-motion';
import Spinner from '../Spinner';

interface NutritionStatsProps {
  isLoading: boolean;
  nutritionTarget: NutritionTarget | null;
  isInTargetPeriod: boolean;
}

const NutritionStats = ({
  isLoading,
  nutritionTarget,
  isInTargetPeriod,
}: NutritionStatsProps) => {
  if (isLoading) {
    return (
      <div className="h-[174px] flex items-center flex-col gap-3 justify-center animate-pulse">
        <Spinner size="size-12" color="text-lime-800" />
        <span className="text-lime-800 font-medium">
          Loading nutrition target...
        </span>
      </div>
    );
  }

  if (!nutritionTarget) {
    return (
      <div className="text-lime-800 text-center text-sm">No target set</div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.4,
        ease: easeInOut,
      }}
      className="flex flex-col gap-6 items-center justify-center"
    >
      <div className="text-center flex flex-col">
        <span className="text-7xl font-semibold text-lime-900 text-center">
          {isInTargetPeriod ? nutritionTarget.calories : '-'}
        </span>
        <span className="text-lime-900 text-sm">remaining calories</span>
      </div>
      <div className="grid grid-cols-4 gap-2 w-full text-stone-700 ">
        <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
          <span className="text-xs text-lime-800">Carbs</span>
          <span className="font-medium text-sm text-lime-900">
            {isInTargetPeriod ? nutritionTarget.carbs : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
          <span className="text-xs text-lime-800">Protein</span>
          <span className="font-medium text-sm text-lime-900">
            {isInTargetPeriod ? nutritionTarget.protein : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
          <span className="text-xs text-lime-800">Fat</span>
          <span className="font-medium text-sm text-lime-900">
            {isInTargetPeriod ? nutritionTarget.fat : '-'}
          </span>
        </div>
        <div className="flex flex-col gap-1 items-center text-center bg-gradient-to-b from-white/30 to-transparent backdrop-blur-sm border border-white/5 shadow rounded-3xl py-2 px-2">
          <span className="text-xs text-lime-800">Fiber</span>
          <span className="font-medium text-sm text-lime-900">
            {isInTargetPeriod ? nutritionTarget.fiber : '-'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionStats;