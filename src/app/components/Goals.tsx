'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

enum Tab {
  yearly = 'yearly',
  q1 = 'q1',
  q2 = 'q2',
  q3 = 'q3',
  q4 = 'q4',
}

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

const Goals = () => {
  const year = new Date().getFullYear();

  // State for storing goals
  const [goals, setGoals] = useState<Record<Tab, Goal[]>>({
    [Tab.yearly]: [],
    [Tab.q1]: [],
    [Tab.q2]: [],
    [Tab.q3]: [],
    [Tab.q4]: [],
  });

  // Refs for uncontrolled inputs
  const refs = {
    [Tab.yearly]: useRef<HTMLInputElement>(null),
    [Tab.q1]: useRef<HTMLInputElement>(null),
    [Tab.q2]: useRef<HTMLInputElement>(null),
    [Tab.q3]: useRef<HTMLInputElement>(null),
    [Tab.q4]: useRef<HTMLInputElement>(null),
  };

  // Handler for adding a goal
  const handleAddGoal = (tab: Tab) => {
    const ref = refs[tab];
    const goalText = ref.current?.value;
    if (goalText?.trim()) {
      const newGoal = {
        id: `${Date.now()}`, // Generate a unique ID using the current timestamp
        text: goalText,
        completed: false,
      };
      setGoals((prev) => ({
        ...prev,
        [tab]: [...prev[tab], newGoal],
      }));
      if (ref.current) ref.current.value = ''; // Clear the input
    }
  };

  // Handler for toggling the completed state of a goal
  const toggleGoalCompletion = (tab: Tab, id: string) => {
    setGoals((prev) => ({
      ...prev,
      [tab]: prev[tab].map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
  };

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
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card className="">
              <CardHeader>
                <CardTitle>{tab.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {goals[tab.value].length === 0 && (
                  <span className="text-sm">{tab.emptyText}</span>
                )}
                {goals[tab.value].map((goal) => (
                  <div key={goal.id} className="flex gap-2">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      defaultChecked={goal.completed}
                      onChange={() => toggleGoalCompletion(tab.value, goal.id)}
                      className="size-5 border-2 mt-0.5"
                    />
                    <label htmlFor={`goal-${goal.id}`} className="flex-grow">
                      {goal.text}
                    </label>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <Input
                    ref={refs[tab.value]}
                    placeholder="Type your goal here..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddGoal(tab.value);
                    }}
                  />
                  <Button
                    className="rounded-md aspect-square"
                    onClick={() => handleAddGoal(tab.value)}
                    size="icon"
                  >
                    <Plus />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Goals;
