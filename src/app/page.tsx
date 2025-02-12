'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab, tabs } from '@/constants/menu';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddActivities from './components/Activities/AddActivities';
import AddGoal from './components/AddGoal';
import LogoutButton from './components/LogoutButton';
import RefreshButton from './components/RefreshButton';
import ThemeToggle from './components/ThemeToggle';
import useVibrate from './hooks/useVibrate';

const Menu = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(Tab.Home);
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

  const handleTabPress = (tab: Tab) => {
    setTab(tab);
    router.replace('/');
  };

  useEffect(() => {
    if (params && params.has('tab')) {
      const tab = params.get('tab') as Tab;
      if (tab) {
        setTab(tab);
      }
    }
  }, [params, router]);

  return (
    <Tabs defaultValue={Tab.Home} value={tab}>
      {/* Tab Headers */}
      <TabsList
        className={cn(
          'fixed inset-x-0 bottom-0 min-h-max flex items-center justify-around pb-5 pt-0 rounded-none z-10',
          // 'bg-gradient-to-b from-stone-800 to-stone-950',
          'bg-stone-900'
        )}
      >
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
            onClick={() => handleTabPress(tab.value)}
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
          <div className="h-[calc(100dvh-84px)] overflow-auto flex flex-col max-w-3xl mx-auto">
            <section className="sticky top-0 px-4 pt-4">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl text-stone-800">
                  {tab.title}
                </h1>
                {tab.value === Tab.Activities && <AddActivities />}
                {tab.value === Tab.Goals && <AddGoal />}
                {tab.value === Tab.Profile && (
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
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
