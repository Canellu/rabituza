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

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Add activity</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Activities</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {activityOptions.map((exercise) => (
            <Fragment key={exercise.id}>
              <DropdownMenuItem
                onSelect={() => handleActivitySelect(exercise.id)}
              >
                <exercise.icon className="text-primary bg-gradient-to-b from-stone-600 to-stone-950 p-1.5 rounded-md min-w-7 min-h-7" />
                {exercise.label}
              </DropdownMenuItem>
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
                    const ActivityComponent = activityOptions.find(
                      (e) => e.id === selectedActivity
                    )?.Component;
                    return ActivityComponent ? (
                      <div className="p-4 pb-16 h-full overflow-auto">
                        <ActivityComponent
                          onClose={() => setIsDrawerOpen(false)}
                        />
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
