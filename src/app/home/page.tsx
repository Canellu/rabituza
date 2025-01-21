"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Goal, ListCheck, User } from "lucide-react";
import Goals from "../components/Goals";
import Profile from "../components/Profile";
import Tracker from "../components/Tracker";
import useVibrate from "../hooks/useVibrate";

enum Tab {
  Tracker = "tracker",
  Goals = "goals",
  Profile = "profile",
}

const tabs = [
  {
    value: Tab.Tracker,
    icon: ListCheck,
    title: "Tracker",
    content: <Tracker />,
  },
  {
    value: Tab.Goals,
    icon: Goal,
    title: "Goals",
    content: <Goals />,
  },
  {
    value: Tab.Profile,
    icon: User,
    title: "Profile",
    content: <Profile />,
  },
];

const Menu = () => {
  const vibrationPattern = [50, 10, 50];

  const vibrate = useVibrate(vibrationPattern);

  return (
    <Tabs defaultValue={Tab.Tracker}>
      {/* Tab Headers */}
      <TabsList className="backdrop-blur-sm gap-1 fixed inset-x-0 bottom-0 w-full min-h-max flex items-center justify-around pb-4 pt-0 rounded-none bg-gradient-to-b from-stone-800 to-stone-950">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "bg-transparent border-none rounded-none px-4 py-3 transition duration-200 ease items-center justify-center flex flex-col text-xs w-24 text-stone-500",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-sm",
              "data-[state=active]:text-primary"
            )}
            onClick={vibrate}
          >
            <tab.icon className="w-5 h-5 mx-auto mb-1" />
            <span>{tab.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0">
          <div className="p-4">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;
