'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab, tabs } from '@/constants/menu';
import { cn } from '@/lib/utils';
import { Leaf } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddActivities from './components/Activities/AddActivities';
import AddGoal from './components/AddGoal';
import LogoutButton from './components/LogoutButton';
import RefreshButton from './components/RefreshButton';
import ThemeToggle from './components/ThemeToggle';
import WorkInProgress from './components/WorkInProgress';
import useVibrate from './hooks/useVibrate';

const Menu = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(Tab.Home);

  const vibrationPatternPress = [90];
  const vibrationPatternRelease = [40];
  const vibrateOnPress = useVibrate(vibrationPatternPress);
  const vibrateOnRelease = useVibrate(vibrationPatternRelease);
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
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={cn('mt-0')}>
          {/* Top bar */}
          <header
            className={cn(
              'sticky top-0 inset-x-0 z-50',
              'px-6 h-16',
              'flex items-center',
              'border-b'
            )}
          >
            <div
              className={cn(
                'flex items-center justify-between w-full max-w-3xl mx-auto'
              )}
            >
              <h1
                className={cn(
                  'font-bold text-2xl text-stone-800 flex items-center gap-2'
                )}
              >
                {tab.title}
                {tab.value === Tab.Health && (
                  <>
                    <Leaf className="text-green-700" />
                    <WorkInProgress />
                  </>
                )}
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
          </header>

          {/* Content */}
          <div className={cn('h-[calc(100dvh-84px)] overflow-y-auto')}>
            <section className={cn('p-6 m-w-3xl mx-auto pb-20')}>
              {tab.content}
            </section>
          </div>
        </TabsContent>
      ))}

      {/* Bottom Menu */}
      <TabsList
        className={cn(
          'fixed inset-x-0 bottom-0 min-h-max flex items-center justify-around pb-5 pt-0 rounded-none z-10',
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
    </Tabs>
  );
};

export default Menu;
