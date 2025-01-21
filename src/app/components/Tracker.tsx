'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const snapPoints = [0.5, 1];

const Tracker = () => {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  return (
    <div className="h-full">
      <Drawer
        snapPoints={snapPoints}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
      >
        <DrawerTrigger className="fixed bottom-28 right-8 px-4 py-3 rounded-full bg-primary flex gap-1 items-center justify-center">
          <Plus className="size-4 text-stone-800" />
          Add exercise
        </DrawerTrigger>
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
          <DrawerHeader>
            <DrawerTitle>Pick exercises to add</DrawerTitle>
            <DrawerDescription>
              You can pick more than one exercise
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col items-center justify-center bg-stone-100 flex-grow rounded-xl m-2">
            SOME STUFF
          </div>
          <DrawerFooter>
            <DrawerClose>Add</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Tracker;
