'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Activity as ActivityIcon, Goal, HomeIcon, User } from 'lucide-react';
import Activities from './components/Activities';
import AddActivities from './components/AddActivities';
import AddGoal from './components/AddGoal';
import Goals from './components/Goals';
import Home from './components/Home';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import RefreshButton from './components/RefreshButton';
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
      <TabsList className="fixed inset-x-0 bottom-0 min-h-max flex items-center justify-around pb-4 pt-0 rounded-none bg-gradient-to-b from-stone-800 to-stone-950">
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
          <div className="h-[calc(100dvh-80px)] overflow-auto flex flex-col max-w-3xl mx-auto">
            <section className="sticky top-0 px-4 pt-4">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl text-stone-800">
                  {tab.title}
                </h1>
                {tab.value === Tab.Activities && <AddActivities />}
                {tab.value === Tab.Goals && <AddGoal />}
                {tab.value === Tab.Profile && (
                  <div className="flex items-center gap-2">
                    <RefreshButton />
                    <LogoutButton />
                  </div>
                )}
              </div>
              <Separator className="mt-4" />
            </section>
            <section className="p-6 grow overflow-auto">{tab.content}</section>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Menu;
