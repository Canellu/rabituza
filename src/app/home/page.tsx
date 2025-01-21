"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Goal, ListCheck, User } from "lucide-react";
import Goals from "../components/Goals";
import Profile from "../components/Profile";
import Tracker from "../components/Tracker";

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
  return (
    <Tabs defaultValue={Tab.Tracker}>
      {/* Tab Headers */}
      <TabsList className="bg-zinc-950/90 backdrop-blur-sm gap-1 fixed inset-x-0 bottom-0 w-full min-h-max flex items-center justify-around pb-6 pt-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "bg-transparent border-none rounded-none px-4 py-3 transition duration-200 ease items-center justify-center flex flex-col font-semibold text-sm w-24 text-zinc-200",
              "data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-sm"
            )}
          >
            <tab.icon className="w-5 h-5 mx-auto mb-1" />
            <span>{tab.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Tab Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <main className="p-4 max-w-7xl mx-auto">{tab.content}</main>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;