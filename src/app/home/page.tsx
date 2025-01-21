"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const vibrationPattern = [300, 50, 300];

  const vibrate = useVibrate(vibrationPattern);

  return (
    <Tabs defaultValue={Tab.Tracker}>
      {/* Tab Headers */}
      <TabsList className="w-full justify-evenly bg-stone-950/90 backdrop-blur-sm fixed inset-x-0 bottom-0 flex items-center pb-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-grow"
            onClick={vibrate}
          >
            <tab.icon className="w-5 h-5 mx-auto mb-1" />
            <span>{tab.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="p-4">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;
