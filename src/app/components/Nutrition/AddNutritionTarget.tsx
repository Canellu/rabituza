'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
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
import SaveButtonDrawer from '../SaveButtonDrawer';
import ActivityLevelSelector from './ActivityLevelSelector';
import NutritionalGoalSelector from './NutritionalGoalSelector';
import NutritionInputs from './NutritionInputs';
import RecommendedValues from './RecommendedValues';
import TargetOccurrence from './TargetOccurrence';

export type NutritionTargetType = Omit<
  NutritionTarget,
  'calories' | 'protein' | 'carbs' | 'fat' | 'fiber'
> & {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
};

export function AddNutritionTarget() {
  const queryClient = useQueryClient();
  const userId = getSession();
  const { data: user, error } = useQuery({
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

  const defaultValues = calculateRecommendedNutritionalValues(
    user,
    selectedActivity
  );

  const initialTarget = {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    isRecurring: false,
    startDate: new Date(),
    isCheatDay: false,
  };

  const [target, setTarget] = useState<
    Omit<
      NutritionTarget,
      'calories' | 'protein' | 'carbs' | 'fat' | 'fiber'
    > & {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
      fiber: string;
    }
  >(initialTarget);

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
    mutationFn: async () => {
      if (!userId) throw new Error('User is not signed in');
      // TODO: Implement your createNutritionTarget function
      // await createNutritionTarget(userId, target);
      console.log('Creating target:', target);
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
    console.log(target);
    // mutate(data);
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsDrawerOpen((prev) => !prev)}
      >
        Add target
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

              <NutritionInputs
                target={target}
                setTarget={setTarget}
                initialTarget={initialTarget}
              />

              <TargetOccurrence
                target={target}
                setTarget={(value) =>
                  setTarget(
                    typeof value === 'function'
                      ? (
                          value as unknown as (
                            prev: typeof target
                          ) => typeof target
                        )(target)
                      : { ...target, ...value }
                  )
                }
              />

              <SaveButtonDrawer
                title="Save target"
                isPending={isPending}
                isDisabled={target.calories === ''}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
