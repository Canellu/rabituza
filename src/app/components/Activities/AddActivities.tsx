'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import activityOptions from '@/constants/activityOptions';
import { ActivityTypes } from '@/types/Activity';
import { Fragment, useState } from 'react';

const AddActivities = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleActivitySelect = (id: string) => {
    setSelectedActivity(id);
    setIsDropdownOpen(false);
    setIsDrawerOpen(true);
  };

  const handleDrawerOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setIsDropdownOpen(false);
    }
  };

  const disabledActivities: Array<
    (typeof ActivityTypes)[keyof typeof ActivityTypes]
  > = [ActivityTypes.WinterSports, ActivityTypes.Rest, ActivityTypes.Swimming];

  const groupedActivities = activityOptions.reduce((acc, activity) => {
    if (!acc[activity.group]) {
      acc[activity.group] = [];
    }
    acc[activity.group].push(activity);
    return acc;
  }, {} as Record<string, (typeof activityOptions)[number][]>);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Add activity</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {Object.entries(groupedActivities).map(([group, activities]) => (
            <Fragment key={group}>
              <DropdownMenuLabel>{group}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {activities.map((exercise) => (
                <Fragment key={exercise.id}>
                  <DropdownMenuItem
                    disabled={disabledActivities.includes(exercise.id)}
                    onSelect={() => handleActivitySelect(exercise.id)}
                  >
                    <exercise.icon className="text-white bg-emerald-500 p-1.5 rounded-md min-w-8 min-h-8" />
                    {exercise.label}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[98%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>
              {activityOptions.find((e) => e.id === selectedActivity)?.label}
            </DrawerTitle>
          </DrawerHeader>
          {selectedActivity && (
            <>
              {activityOptions.find((e) => e.id === selectedActivity)
                ?.Component && (
                <div className="flex-grow overflow-y-auto">
                  {(() => {
                    const ActivityForm = activityOptions.find(
                      (e) => e.id === selectedActivity
                    )?.Component;
                    return ActivityForm ? (
                      <div className="p-4 pb-16 h-full overflow-auto">
                        <ActivityForm onClose={() => setIsDrawerOpen(false)} />
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default AddActivities;
