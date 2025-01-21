"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";

const Tracker = () => {
  return (
    <div className="h-full">
      <Drawer>
        <DrawerTrigger className="fixed bottom-28 right-8 px-4 py-3 rounded-full bg-primary flex gap-1 items-center justify-center">
          <Plus className="size-4 text-stone-800" />
          Add exercise
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Pick exercises to add</DrawerTitle>
            <DrawerDescription>Exercise 1</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Add</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Tracker;
