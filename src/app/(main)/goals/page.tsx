"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

enum Tab {
  yearly = "yearly",
  q1 = "q1",
  q2 = "q2",
  q3 = "q3",
  q4 = "q4",
}

interface Goal {
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
      setGoals((prev) => ({
        ...prev,
        [tab]: [...prev[tab], { text: goalText, completed: false }],
      }));
      if (ref.current) ref.current.value = ""; // Clear the input
    }
  };

  // Handler for toggling the completed state of a goal
  const toggleGoalCompletion = (tab: Tab, index: number) => {
    setGoals((prev) => ({
      ...prev,
      [tab]: prev[tab].map((goal, i) =>
        i === index ? { ...goal, completed: !goal.completed } : goal
      ),
    }));
  };

  // Tab configurations
  const tabs = [
    { value: Tab.yearly, title: `${year} Goals`, shortTitle: "Yearly" },
    { value: Tab.q1, title: "Jan - Mar", shortTitle: "Q1" },
    { value: Tab.q2, title: "Apr - Jun", shortTitle: "Q2" },
    { value: Tab.q3, title: "Jul - Sep", shortTitle: "Q3" },
    { value: Tab.q4, title: "Oct - Dec", shortTitle: "Q4" },
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
            <Card>
              <CardHeader>
                <CardTitle>{tab.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {goals[tab.value].map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleGoalCompletion(tab.value, index)}
                    />
                    <span
                      className={
                        goal.completed ? "line-through text-gray-500" : ""
                      }
                    >
                      {goal.text}
                    </span>
                  </div>
                ))}
                <div className="flex gap-2 mt-4">
                  <Input
                    ref={refs[tab.value]}
                    placeholder="Type your goal here..."
                  />
                  <Button
                    className="rounded-sm aspect-square"
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
