'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createOrUpdateGoal } from '@/lib/database/goals/createOrUpdateGoal';
import { getGoals } from '@/lib/database/goals/getGoals';
import { cn } from '@/lib/utils';
import { splitGoalsByTimePeriod, TimePeriod } from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { Goal, GoalStatus } from '@/types/Goal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Reorder } from 'framer-motion';
import { GripVertical, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import AddGoal from './AddGoal';
import Spinner from './Spinner';

const Goals = () => {
  const [activeTab, setActiveTab] = useState<TimePeriod>(TimePeriod.Year);
  const [editable, setEditable] = useState(false);
  const [localGoals, setLocalGoals] = useState<Goal[]>([]);
  const year = new Date().getFullYear();
  const userId = getSession();

  const { isLoading, error, data } = useQuery<Goal[], Error>({
    queryKey: ['goals', userId],
    queryFn: () => getGoals(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      setLocalGoals(data);
    }
  }, [data]);

  // Define mutation
  const queryClient = useQueryClient(); // Add this at the top of the component

  // Modify the mutation configuration
  const { mutate } = useMutation({
    mutationFn: (updatedGoal: Goal) => {
      if (!userId || !updatedGoal.id) {
        throw new Error('Missing userId or goalId');
      }
      return createOrUpdateGoal(userId, updatedGoal.id, updatedGoal);
    },
    onSuccess: () => {
      // Invalidate and refetch goals after successful mutation
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error, variables) => {
      console.error('Failed to update goal:', error);
      setLocalGoals((prev) =>
        prev.map((g) =>
          g.id === variables.id
            ? {
                ...g,
                status:
                  g.status === GoalStatus.Completed
                    ? GoalStatus.InProgress
                    : GoalStatus.Completed,
              }
            : g
        )
      );
    },
  });

  // Debounced mutation handler
  const debouncedMutation = useDebounce((goal: Goal) => {
    if (!userId || !goal.id) return;
    mutate(goal);
  }, 500);

  const handleCheck = (goal: Goal) => {
    if (!goal.id) return;

    const newStatus =
      goal.status === GoalStatus.Completed
        ? GoalStatus.InProgress
        : GoalStatus.Completed;

    const updatedGoal = {
      ...goal,
      status: newStatus,
    };

    // Update local state
    setLocalGoals((prev) =>
      prev.map((g) => (g.id === goal.id ? updatedGoal : g))
    );

    // Trigger mutation
    debouncedMutation(updatedGoal);
  };

  const splittedGoals = splitGoalsByTimePeriod(localGoals);

  const handleReorder = (newOrder: Goal[]) => {
    // Only update local state during dragging
    setLocalGoals((prev) => {
      const activeTabGoalsMap = new Set(
        splittedGoals[activeTab].map((g) => g.id)
      );
      const otherGoals = prev.filter((goal) => !activeTabGoalsMap.has(goal.id));

      // Preserve the order field from previous state for the reordered items
      const orderedNewGoals = newOrder.map((goal, index) => ({
        ...goal,
        order: index,
      }));

      return [...otherGoals, ...orderedNewGoals];
    });
  };

  const handleReorderEnd = () => {
    const currentGoals = splittedGoals[activeTab];
    // Get original goals for the current time period
    const originalGoals =
      data
        ?.filter((goal) => {
          const goalPeriod = splitGoalsByTimePeriod([goal])[activeTab];
          return goalPeriod?.length > 0;
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) || [];

    // Compare orders within the same time period
    const hasOrderChanged = currentGoals.some((goal, index) => {
      const originalIndex = originalGoals.findIndex((g) => g.id === goal.id);
      return originalIndex !== index;
    });

    if (hasOrderChanged) {
      currentGoals.forEach((goal, index) => {
        if (userId && goal.id) {
          mutate({
            ...goal,
            order: index,
          });
        }
      });
    }
  };

  return (
    <div className="relative flex flex-col gap-4 pb-10 min-h-full">
      <div className="flex items-center justify-between gap-3">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TimePeriod)}
          className="flex-grow"
        >
          <TabsList className="w-full justify-evenly">
            {Object.values(TimePeriod).map((tab) => (
              <TabsTrigger key={tab} value={tab} className="flex-grow">
                {tab.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button
          size="icon"
          variant={editable ? 'secondary' : 'default'}
          className="rounded-md size-8"
          onClick={() => setEditable((prev) => !prev)}
        >
          {editable ? <X /> : <Plus />}
        </Button>
      </div>

      <AddGoal
        editable={editable}
        setEditable={setEditable}
        setActiveTab={setActiveTab}
      />

      {splittedGoals[activeTab]?.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={splittedGoals[activeTab]}
          onReorder={handleReorder}
          className="flex flex-col items-center gap-3"
        >
          {splittedGoals[activeTab].map((goal) => (
            <Reorder.Item
              key={goal.id}
              value={goal}
              id={goal.id}
              onDragEnd={() => {
                handleReorderEnd();
              }}
              className={cn(
                ` rounded-lg p-5 pl-3 border flex flex-row gap-3 items-center w-full ${
                  goal.status === GoalStatus.Completed
                    ? 'bg-primary/50 shadow-none'
                    : 'bg-secondary shadow-sm'
                }`
              )}
            >
              <GripVertical className="size-5 text-stone-400 cursor-grab active:cursor-grabbing" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold capitalize">
                  {goal.title}
                </h2>
                <p className="text-stone-600 text-sm">{goal.description}</p>
              </div>
              <Checkbox
                className={cn(
                  'size-5 bg-white',
                  'data-[state=checked]:bg-secondary'
                )}
                checked={goal.status === GoalStatus.Completed}
                onClick={() => handleCheck(goal)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="text-stone-500 text-center max-w-44 mx-auto">
          You have no goals for{' '}
          {activeTab === TimePeriod.Year ? year : activeTab} 🥲
        </div>
      )}

      {(error || isLoading) && (
        <div className="flex flex-col items-center gap-3 justify-center flex-grow">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <Spinner />
              <span className="text-stone-500">Fetching goals...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 bg-red-100 rounded-md py-2 px-4 text-center">
              Error fetching goals
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals;
