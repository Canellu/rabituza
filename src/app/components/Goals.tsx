'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddGoal from './AddGoal';

enum Tab {
  yearly = 'yearly',
  q1 = 'q1',
  q2 = 'q2',
  q3 = 'q3',
  q4 = 'q4',
}

const Goals = () => {
  const year = new Date().getFullYear();

  // Tab configurations
  const tabs = [
    {
      value: Tab.yearly,
      title: year,
      shortTitle: 'Yearly',
      emptyText: 'Seems a bit empty here... 🥲',
    },
    {
      value: Tab.q1,
      title: 'Jan - Mar',
      shortTitle: 'Q1',
      emptyText: 'Atleast set one goal for this quarter! 🎯',
    },
    {
      value: Tab.q2,
      title: 'Apr - Jun',
      shortTitle: 'Q2',
      emptyText: 'Hmm, need help setting goals? 🤔',
    },
    {
      value: Tab.q3,
      title: 'Jul - Sep',
      shortTitle: 'Q3',
      emptyText: 'Cmon, you can do it! 💪',
    },
    {
      value: Tab.q4,
      title: 'Oct - Dec',
      shortTitle: 'Q4',
      emptyText: 'Set a goal, achieve it, gitgud! 🚀',
    },
  ];

  return (
    <div>
      <Tabs defaultValue={Tab.yearly}>
        <TabsList className="w-full justify-evenly">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="flex-grow"
              value={tab.value}
            >
              {tab.shortTitle}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AddGoal />
    </div>
  );
};

export default Goals;
