'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createOrUpdateGoal } from '@/lib/database/goals/createOrUpdateGoal';
import { deleteGoal } from '@/lib/database/goals/deleteGoal';
import { getGoals } from '@/lib/database/goals/getGoals';
import { cn } from '@/lib/utils';
import { splitGoalsByTimePeriod, TimePeriod } from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { Goal, GoalStatus } from '@/types/Goal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, PanInfo, Reorder } from 'framer-motion';
import { ArrowDownUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import AddGoal from './AddGoal';
import Spinner from './Spinner';

const Goals = () => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [activeTab, setActiveTab] = useState<TimePeriod>(TimePeriod.Year);
  const [isEditing, setIsEditing] = useState(false);
  const [localGoals, setLocalGoals] = useState<Goal[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const splittedGoals = splitGoalsByTimePeriod(localGoals);
  const haveGoals = splittedGoals[activeTab]?.length > 0;
  const year = new Date().getFullYear();

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

  const { mutate } = useMutation({
    mutationFn: (updatedGoal: Goal) => {
      if (!userId || !updatedGoal.id) {
        throw new Error('Missing userId or goalId');
      }
      return createOrUpdateGoal(userId, updatedGoal.id, updatedGoal);
    },
    onSuccess: () => {
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

  // Add this mutation before the handleDragEnd function
  const { mutate: deleteGoalMutation } = useMutation({
    mutationFn: ({ userId, goalId }: { userId: string; goalId: string }) =>
      deleteGoal(userId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error) => {
      console.error('Failed to delete goal:', error);
      // Optionally, you could restore the deleted goal in the local state here
    },
  });

  const handleDragEnd = (info: PanInfo, goal: Goal) => {
    if (info.offset.x < -56 * 3) {
      // Delete the goal when dragged far enough left
      setLocalGoals((prev) => prev.filter((g) => g.id !== goal.id));
      if (userId && goal.id) {
        deleteGoalMutation({ userId, goalId: goal.id });
      }
    }
    setDraggingId(null);
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

        <div className="flex gap-1">
          <Button
            size="icon"
            variant="outline"
            className={cn(
              'shadow-sm rounded-md size-8',
              isOrdering ? 'shadow-inner !bg-stone-200 border-stone-300' : ''
            )}
            onClick={() => setIsOrdering((prev) => !prev)}
          >
            <ArrowDownUp />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className={cn(
              'shadow rounded-md size-8 border',
              isEditing ? 'shadow-inner !bg-stone-200 border-stone-300' : ''
            )}
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <Plus />
          </Button>
        </div>
      </div>

      <AddGoal
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setActiveTab={setActiveTab}
      />

      {haveGoals && (
        <Reorder.Group
          axis="y"
          values={splittedGoals[activeTab]}
          onReorder={handleReorder}
          className="flex flex-col gap-3 "
        >
          <AnimatePresence>
            {splittedGoals[activeTab].map((goal) => (
              <Reorder.Item
                key={goal.id}
                value={goal}
                id={goal.id}
                onDragEnd={() => {
                  handleReorderEnd();
                  setDraggingId(null);
                }}
                dragListener={isOrdering && !draggingId}
              >
                <motion.div
                  className="relative"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-1 bg-red-500 rounded-lg flex items-center justify-end px-4 ">
                    <Trash2 className="text-secondary" />
                  </div>
                  <motion.div
                    className={cn(
                      `${
                        goal.status === GoalStatus.Completed
                          ? 'bg-primary shadow-none'
                          : 'bg-secondary shadow-sm'
                      }`,
                      'rounded-lg p-5  border flex flex-row gap-3 items-center w-full transition-colors duration-200 ease-in-out',
                      'relative',
                      isOrdering ? 'pl-3' : 'pl-5'
                    )}
                    drag={!isOrdering ? 'x' : false} // Disable drag when isOrdering is true
                    dragDirectionLock
                    whileDrag={{ cursor: 'grabbing' }}
                    dragConstraints={{ left: -250, right: 0 }}
                    dragSnapToOrigin
                    dragElastic={{ left: 0.5, right: 0 }}
                    onDragStart={() => setDraggingId(goal.id!)}
                    onDragEnd={(_, info) => handleDragEnd(info, goal)}
                  >
                    <GripVertical
                      className={cn(
                        'size-5 text-stone-400',
                        isOrdering ? 'block' : 'hidden'
                      )}
                    />
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold capitalize">
                        {goal.title}
                      </h2>
                      <p className="text-stone-600 text-sm">
                        {goal.description}
                      </p>
                    </div>
                    <Checkbox
                      className={cn(
                        'size-5 bg-white',
                        'data-[state=checked]:bg-secondary'
                      )}
                      checked={goal.status === GoalStatus.Completed}
                      onClick={() => handleCheck(goal)}
                    />
                  </motion.div>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {!isLoading && !error && !haveGoals && (
        <div className="text-stone-500 text-center max-w-44 mx-auto">
          You have no goals for{' '}
          {activeTab === TimePeriod.Year ? year : activeTab} 🥲
        </div>
      )}

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
  );
};

export default Goals;
