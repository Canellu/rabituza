'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGoals } from '@/lib/database/goals/getGoals';
import { splitGoalsByTimePeriod, TimePeriod } from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import AddGoal from './AddGoal';
import Spinner from './Spinner';

const Goals = () => {
  const [activeTab, setActiveTab] = useState<TimePeriod>(TimePeriod.Year);
  const [editable, setEditable] = useState(false);
  const year = new Date().getFullYear();

  // Fetch userId from localStorage
  const userId = getSession(); // Directly fetch from localStorage

  const {
    data: goals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => getGoals(userId!), // Query only runs if we have userId, if we have userId then it's a string
    enabled: !!userId,
  });

  const splittedGoals = splitGoalsByTimePeriod(goals);

  return (
    <div className="relative flex flex-col gap-4 pb-10 min-h-full">
      {/* Tabs for Time Period */}
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

        {/* Add Goal Button */}
        <Button
          size="icon"
          variant={editable ? 'secondary' : 'default'}
          className="rounded-md size-8"
          onClick={() => setEditable((prev) => !prev)}
        >
          {editable ? <X /> : <Plus />}
        </Button>
      </div>

      {/* Add Goal Form */}
      <AddGoal editable={editable} setEditable={setEditable} />

      {/* Display Goals */}
      {splittedGoals[activeTab]?.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          {splittedGoals[activeTab].map((goal) => (
            <div
              key={goal.id}
              className="bg-primary/10 rounded-lg p-5 border flex flex-col gap-1 shadow-sm w-full"
            >
              <h2 className="text-lg font-semibold capitalize">{goal.title}</h2>
              <p className="text-stone-600 text-sm">{goal.description}</p>
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
          {!isLoading && (
            <div className="flex flex-col items-center justify-center gap-3">
              <Spinner />
              <span className="text-stone-500">Fetching goals...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 bg-red-100  rounded-md py-2 px-4 text-center">
              Error fetching goals
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals;
