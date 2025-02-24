'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  STAGGER_CHILD_VARIANTS,
  STAGGER_CONTAINER_CONFIG,
} from '@/constants/animationConfig';
import { createOrUpdateGoal } from '@/lib/database/goals/createOrUpdateGoal';
import { deleteGoal } from '@/lib/database/goals/deleteGoal';
import { getGoals } from '@/lib/database/goals/getGoals';
import { cn } from '@/lib/utils';
import { splitGoalsByTimePeriod, TimePeriod } from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { GoalStatus, GoalType } from '@/types/Goal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { ArrowDownUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../lib/hooks/useDebounce';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import Spinner from './Spinner';

const Goals = () => {
  const queryClient = useQueryClient();
  const userId = getSession();

  const [activeTab, setActiveTab] = useState<TimePeriod>(TimePeriod.Year);
  const [localGoals, setLocalGoals] = useState<GoalType[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);

  const splittedGoals = splitGoalsByTimePeriod(localGoals);
  const haveGoals = splittedGoals[activeTab]?.length > 0;
  const year = new Date().getFullYear();

  const handleEditGoal = (goal: GoalType) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const { isLoading, error, data } = useQuery<GoalType[], Error>({
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
    mutationFn: (updatedGoal: GoalType) => {
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
        prev.map((g) => {
          if (g.id !== variables.id) {
            return g;
          }

          const newStatus =
            g.status === GoalStatus.Completed
              ? GoalStatus.InProgress
              : GoalStatus.Completed;

          return {
            ...g,
            status: newStatus,
          };
        })
      );
    },
  });

  const debouncedMutation = useDebounce((goal: GoalType) => {
    if (!userId || !goal.id) return;
    mutate(goal);
  }, 250);

  const handleCheck = (goal: GoalType) => {
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

  const handleReorder = (newOrder: GoalType[]) => {
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

  const handleDelete = (goal: GoalType) => {
    if (!userId || !goal.id) return;
    deleteGoalMutation({ userId, goalId: goal.id });
  };

  return (
    <div className="relative flex flex-col gap-4 pb-10 min-h-full">
      <div className="flex items-center justify-between gap-2">
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
            variant="secondary"
            className={cn(
              isOrdering ? 'shadow-inner !bg-stone-200 border-stone-300' : ''
            )}
            onClick={() => setIsOrdering((prev) => !prev)}
          >
            <ArrowDownUp />
          </Button>
        </div>
      </div>

      {haveGoals && (
        <Reorder.Group
          axis="y"
          values={splittedGoals[activeTab]}
          onReorder={handleReorder}
          className="flex flex-col gap-3"
          {...STAGGER_CONTAINER_CONFIG}
        >
          <AnimatePresence>
            {splittedGoals[activeTab].map((goal) => (
              <motion.div key={goal.id} variants={STAGGER_CHILD_VARIANTS}>
                <Reorder.Item
                  value={goal}
                  id={goal.id}
                  onDragEnd={() => {
                    handleReorderEnd();
                    setDraggingId(null);
                  }}
                  dragListener={isOrdering && !draggingId}
                >
                  <GoalCard
                    goal={goal}
                    isOrdering={isOrdering}
                    draggingId={draggingId}
                    deleteGoal={() => handleDelete(goal)}
                    onCheck={handleCheck}
                    onEdit={() => handleEditGoal(goal)}
                  />
                </Reorder.Item>
              </motion.div>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {!isLoading && !error && !haveGoals && (
        <div className="text-stone-600 text-center p-4 mx-auto">
          {activeTab === TimePeriod.Year && `You have no goals for ${year} 🥲`}
          {activeTab === TimePeriod.Q1 &&
            'Break down your yearly goals into manageable chunks to start the year strong.'}
          {activeTab === TimePeriod.Q2 &&
            'Reflect on your progress and set new goals for the upcoming months.'}
          {activeTab === TimePeriod.Q3 &&
            'Reassess your objectives and make adjustments to stay on track.'}
          {activeTab === TimePeriod.Q4 &&
            'Finish the year strong by setting clear and achievable goals.'}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <GoalForm
                    initialGoal={selectedGoal}
                    onClose={() => setIsDialogOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
