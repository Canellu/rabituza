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
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
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
  const { mutate } = useMutation({
    mutationFn: (updatedGoal: Goal) => {
      if (!userId || !updatedGoal.id) {
        throw new Error('Missing userId or goalId');
      }
      return createOrUpdateGoal(userId, updatedGoal.id, updatedGoal);
    },
    onError: (error, variables) => {
      console.error('Failed to update goal:', error);
      // Rollback on error
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

      <AddGoal editable={editable} setEditable={setEditable} />

      {splittedGoals[activeTab]?.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          {splittedGoals[activeTab].map((goal) => (
            <div
              id="card"
              key={goal.id}
              className={cn(
                ` rounded-lg p-5 border flex flex-row justify-between gap-2 items-center w-full cursor-pointer ${
                  goal.status === GoalStatus.Completed
                    ? 'bg-primary/50 shadow-none'
                    : 'bg-secondary shadow-sm'
                }`
              )}
              onClick={() => handleCheck(goal)}
            >
              <div>
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
              />
            </div>
          ))}
        </div>
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
