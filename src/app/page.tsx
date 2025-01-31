'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Activity as ActivityIcon, Goal, HomeIcon, User } from 'lucide-react';
import Activities from './components/Activities';
import Goals from './components/Goals';
import Home from './components/Home';
import Profile from './components/Profile';
import useVibrate from './hooks/useVibrate';

enum Tab {
  Home = 'home',
  Activities = 'activities', // Changed from 'activity' to 'activities'
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
    value: Tab.Activities, // Updated to use the plural form
    icon: ActivityIcon,
    title: 'Activities', // Updated to use the plural form
    content: <Activities />,
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
  const vibrationPatternPress = [90]; // Vibrate when pressed
  const vibrationPatternRelease = [40]; // Vibrate when released

  const vibrateOnPress = useVibrate(vibrationPatternPress);
  const vibrateOnRelease = useVibrate(vibrationPatternRelease);

  // Combine both mouse and touch event handlers
  const handlePress = () => {
    vibrateOnPress();
  };

  const handleRelease = () => {
    vibrateOnRelease();
  };

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
              'data-[state=active]:text-primary',
              '[&[data-state=active]_span]:text-stone-50'
            )}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
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
            <section className="sticky top-0  bg-gradient-to-b from-stone-100 to-transparent backdrop-blur-sm border-b p-4 after:inset-0 after:absolute after:bg-white/80 after:-z-10 z-[100]">
              <h1 className="font-bold text-2xl text-stone-800">{tab.title}</h1>
            </section>
            <section className="p-6 grow overflow-auto">{tab.content}</section>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;
