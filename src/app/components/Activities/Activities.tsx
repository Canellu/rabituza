'use client';

// Change the import from drawer to dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getActivities } from '@/lib/database/activities/getActivities';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Spinner from '../Spinner';
import ActivitiesList from './ActivitiesList';
import ActivitiesMonth from './ActivitiesMonth';
import AcitvitiesWeek from './ActivitiesWeek';
import ActivitiesYear from './ActivitiesYear';
import ActivityForm from './ActivityForm';

const Activities = () => {
  const userId = getSession();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<'week' | 'month' | 'year'>(
    'week'
  );

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', userId],
    queryFn: () => (userId ? getActivities(userId) : Promise.resolve([])),
    enabled: !!userId,
  });

  const showActivitiesList = selectedTab !== 'year';

  const filteredActivities = activities?.filter(
    (activity) =>
      new Date(activity.activityDate).toLocaleDateString() ===
      selectedDate.toLocaleDateString()
  );

  const handleEditActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col gap-4 h-full">
        <Spinner />
        <span className="text-stone-500 font-medium text-sm">
          Loading activities...
        </span>
      </div>
    );
  }
  return (
    <div className="h-full space-y-10">
      <section className="space-y-4">
        <Tabs
          value={selectedTab}
          onValueChange={(value) =>
            setSelectedTab(value as 'week' | 'month' | 'year')
          }
          className="w-full"
        >
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="week" className="flex-grow">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-grow">
              Month
            </TabsTrigger>
            <TabsTrigger value="year" className="flex-grow">
              Year
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week">
            <AcitvitiesWeek
              activities={activities}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </TabsContent>
          <TabsContent value="month">
            <ActivitiesMonth
              activities={activities}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </TabsContent>
          <TabsContent value="year">
            <ActivitiesYear activities={activities} />
          </TabsContent>
        </Tabs>
      </section>

      {showActivitiesList && (
        <ActivitiesList
          activities={filteredActivities}
          selectedDate={selectedDate}
          onEditActivity={handleEditActivity}
        />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <ActivityForm
                    selectedActivity={selectedActivity}
                    onClose={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Activities;
