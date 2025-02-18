'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { createOrUpdateNutritionTarget } from '@/lib/database/nutrition/targets/createOrUpdateNutritionTarget';
import { getUser } from '@/lib/database/user/getUser';
import {
  activityLevels,
  calculateRecommendedNutritionalValues,
  nutritionalGoals,
} from '@/lib/utils/nutrition';
import { getSession } from '@/lib/utils/userSession';
import type { NutritionTarget } from '@/types/Nutrition';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SaveButtonDrawer from '../../SaveButtonDrawer';
import ActivityLevelSelector from './ActivityLevelSelector';
import NutritionalGoalSelector from './NutritionalGoalSelector';
import NutritionTargetInputs from './NutritionTargetInputs';
import RecommendedValues from './RecommendedValues';
import TargetOccurrence from './TargetOccurrence';

export type NutritionTargetType = Pick<
  NutritionTarget,
  'startDate' | 'daysOfWeek'
> & {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  endDate: Date | null;
};

export function AddNutritionTarget() {
  const queryClient = useQueryClient();
  const userId = getSession();
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is null');
      return getUser(userId);
    },
    enabled: !!userId,
  });

  const [selectedActivity, setSelectedActivity] = useState<
    keyof typeof activityLevels | undefined
  >();
  const [selectedGoal, setSelectedGoal] = useState<
    keyof typeof nutritionalGoals | undefined
  >();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const initialTarget = {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    startDate: new Date(),
    endDate: null,
    daysOfWeek: [0, 1, 2, 3, 4], // Mon to Fri
  };

  const [target, setTarget] = useState<NutritionTargetType>(initialTarget);

  const handleActivityChange = (activity: keyof typeof activityLevels) => {
    setSelectedActivity(activity);
    updateNutritionalValues(activity, selectedGoal);
  };

  const handleGoalChange = (goal: keyof typeof nutritionalGoals) => {
    setSelectedGoal(goal);
    updateNutritionalValues(selectedActivity, goal);
  };

  const updateNutritionalValues = (
    activity?: keyof typeof activityLevels,
    goal?: keyof typeof nutritionalGoals
  ) => {
    if (activity && goal) {
      const newValues = calculateRecommendedNutritionalValues(
        user,
        activity,
        goal
      );
      setTarget((prev) => ({
        ...prev,
        calories: newValues.calories,
        protein: newValues.protein,
        carbs: newValues.carbs,
        fat: newValues.fat,
        fiber: newValues.fiber,
      }));
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Omit<NutritionTarget, 'id'>) => {
      if (!userId) throw new Error('User is not signed in');
      await createOrUpdateNutritionTarget(userId, data);
      console.log('Creating target:', data);
    },
    onSuccess: () => {
      setIsDrawerOpen(false);
      setTarget(initialTarget);
      queryClient.invalidateQueries({ queryKey: ['nutritionTargets', userId] });
    },
    onError: (error) => {
      console.error('Error creating nutrition target:', error);
    },
  });

  const handleSubmit = () => {
    if (!target.endDate) {
      console.error('End date is required');
      return;
    }

    const data = {
      ...target,
      calories: parseInt(target.calories),
      protein: parseInt(target.protein),
      carbs: parseInt(target.carbs),
      fat: parseInt(target.fat),
      fiber: parseInt(target.fiber),
      endDate: target.endDate,
    };

    mutate(data);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="bg-transparent text-emerald-800 border-emerald-800"
        onClick={() => setIsDrawerOpen((prev) => !prev)}
      >
        Create new target
      </Button>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={(open) => {
          setIsDrawerOpen(open);
          if (!open) {
            setTarget(initialTarget);
            setSelectedActivity(undefined);
            setSelectedGoal(undefined);
          }
        }}
      >
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Set Nutritional Target</DrawerTitle>
            <DrawerDescription>
              Take control of your nutrition journey by setting personalized
              targets.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-16 h-full overflow-auto">
            <div className="flex flex-col gap-6">
              <RecommendedValues
                user={user}
                selectedActivity={selectedActivity}
                onActivitySelect={handleActivityChange}
              />

              <ActivityLevelSelector
                selectedActivity={selectedActivity}
                onActivityChange={handleActivityChange}
              />

              <NutritionalGoalSelector
                selectedGoal={selectedGoal}
                onGoalChange={handleGoalChange}
              />

              <NutritionTargetInputs target={target} setTarget={setTarget} />

              <TargetOccurrence
                target={target}
                setTarget={(value) => setTarget(value)}
              />

              <SaveButtonDrawer
                title="Save target"
                isPending={isPending}
                isDisabled={
                  !target.calories ||
                  !target.protein ||
                  !target.carbs ||
                  !target.fat ||
                  !target.fiber ||
                  !target.startDate ||
                  !target.endDate ||
                  target.daysOfWeek.length === 0
                }
                onClick={handleSubmit}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
