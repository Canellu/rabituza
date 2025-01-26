'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/tailwind';
import { Goal, HomeIcon, ListCheck, User } from 'lucide-react';
import Goals from './components/Goals';
import Home from './components/Home';
import Profile from './components/Profile';
import Tracker from './components/Tracker';
import useVibrate from './hooks/useVibrate';

enum Tab {
  Home = 'home',
  Tracker = 'tracker',
  Goals = 'goals',
  Profile = 'profile',
}

const tabs = [
  {
    value: Tab.Home,
    icon: HomeIcon,
    title: 'Home',
    content: <Home />,
  },
  {
    value: Tab.Tracker,
    icon: ListCheck,
    title: 'Tracker',
    content: <Tracker />,
  },
  {
    value: Tab.Goals,
    icon: Goal,
    title: 'Goals',
    content: <Goals />,
  },
  {
    value: Tab.Profile,
    icon: User,
    title: 'Profile',
    content: <Profile />,
  },
];

const Menu = () => {
  const vibrationPattern = [50, 10, 50];

  const vibrate = useVibrate(vibrationPattern);

  return (
    <Tabs defaultValue={Tab.Home}>
      {/* Tab Headers */}
      <TabsList className="backdrop-blur-sm gap-1 fixed inset-x-0 bottom-0 w-full min-h-max flex items-center justify-around pb-4 pt-0 rounded-none bg-gradient-to-b from-stone-800 to-stone-950">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'bg-transparent border-none rounded-none px-4 py-3 transition duration-200 ease items-center justify-center flex flex-col text-xs w-24 text-stone-500',
              'data-[state=active]:bg-transparent data-[state=active]:shadow-sm',
              'data-[state=active]:text-primary'
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
          <div className="h-[calc(100dvh-80px)] overflow-auto flex flex-col ">
            <section className="sticky top-0  bg-gradient-to-b from-stone-100 to-transparent backdrop-blur-sm border-b p-4 after:inset-0 after:absolute after:bg-white/80 after:-z-10 z-[51]">
              <h1 className="font-bold text-2xl text-stone-800">{tab.title}</h1>
            </section>
            <section className="p-4 grow">{tab.content}</section>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;
