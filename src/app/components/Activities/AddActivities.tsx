'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [isOpen, setIsOpen] = useState(false); // renamed from isDrawerOpen
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleActivitySelect = (id: string) => {
    setSelectedActivity(id);
    setIsDropdownOpen(false);
    setIsOpen(true); // updated
  };

  // Replace handleDrawerOpenChange with simpler function
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
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

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>
              {activityOptions.find((e) => e.id === selectedActivity)?.label}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add Activity
            </DialogDescription>
          </DialogHeader>
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
                      <div className="p-4">
                        <ActivityForm onClose={() => setIsOpen(false)} />
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddActivities;
