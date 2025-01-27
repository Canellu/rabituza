'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddGoal from './AddGoal';

enum Tab {
  yearly = 'yearly',
  q1 = 'q1',
  q2 = 'q2',
  q3 = 'q3',
  q4 = 'q4',
}

const Goals = () => {
  const [editable, setEditable] = useState(false);
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
    <div className="relative flex flex-col gap-8">
      <div className="flex items-center justify-between gap-2">
        <Tabs defaultValue={Tab.yearly} className="flex-grow">
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

        <Button
          size="icon"
          className="rounded-md size-8"
          onClick={() => setEditable((prev) => !prev)}
        >
          <Plus />
        </Button>
      </div>

      <AddGoal editable={editable} setEditable={setEditable} />
      <div className="flex flex-col gap-3">
        <div className="bg-teal-100/60 rounded-xl p-5 border border-teal-200">
          <h2 className="text-lg font-bold">Goal 1</h2>
          <p className="text-stone-600">Description of goal 1</p>
        </div>
        <div className="bg-red-100/60 rounded-xl p-5 border border-red-200">
          <h2 className="text-lg font-bold">Goal 2</h2>
          <p className="text-stone-600">Description of goal 2</p>
        </div>
        <div className="bg-fuchsia-100/60 rounded-xl p-5 border border-fuchsia-200">
          <h2 className="text-lg font-bold">Goal 3</h2>
          <p className="text-stone-600">Description of goal 3</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
        <div className="bg-yellow-100/60 rounded-xl p-5 border border-yellow-300">
          <h2 className="text-lg font-bold">Goal 4</h2>
          <p className="text-stone-600">Description of goal 4</p>
        </div>
      </div>
    </div>
  );
};

export default Goals;
