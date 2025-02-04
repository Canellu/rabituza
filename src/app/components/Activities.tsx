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
import { Activity, Dumbbell, Mountain } from 'lucide-react';
import { Fragment, useState } from 'react';
import { GrYoga } from 'react-icons/gr';

import BoulderingForm from './BoulderingForm';

const GymForm = () => (
  <div className="p-4">Gym workout specific form/content</div>
);

const CalisthenicsForm = () => (
  <div className="p-4">Calisthenics specific form/content</div>
);

const StretchingForm = () => (
  <div className="p-4">Stretching specific form/content</div>
);

const activityOptions = [
  {
    id: 'bouldering',
    label: 'Bouldering',
    Component: BoulderingForm,
    icon: Mountain,
  },
  {
    id: 'gym',
    label: 'Gym',
    Component: GymForm,
    icon: Dumbbell,
  },
  {
    id: 'calisthenics',
    label: 'Calisthenics',
    Component: CalisthenicsForm,
    icon: Activity,
  },
  {
    id: 'stretching',
    label: 'Stretching',
    Component: StretchingForm,
    icon: GrYoga,
  },
] as const;

const Activities = () => {
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
    <div className="h-full">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-28 right-8"
          >
            Add activity
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Activities</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {activityOptions.map((exercise) => (
            <Fragment key={exercise.id}>
              <DropdownMenuItem
                onSelect={() => handleActivitySelect(exercise.id)}
              >
                <exercise.icon className="text-primary bg-gradient-to-b from-stone-600 to-stone-950 p-1 rounded-sm min-w-6 min-h-6" />
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
                        <ActivityComponent />
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Activities;
