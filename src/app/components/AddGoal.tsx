'use client';

import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import MultiSelect, { Option } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils/cn';

const categories = ['Health', 'Personal Growth', 'Other'];
const timePeriods = ['Year', 'Q1', 'Q2', 'Q3', 'Q4'];
const tagsList: Option[] = [
  { label: 'Fitness', value: 'Fitness' },
  { label: 'Reading', value: 'Reading' },
  { label: 'Running', value: 'Running' },
  { label: 'Swimming', value: 'Swimming' },
  { label: 'Writing', value: 'Writing' },
  { label: 'Yoga', value: 'Yoga' },
];

const AddGoal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Option[]>(tagsList);
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  return (
    <div className="h-full">
      <Drawer>
        <DrawerTrigger className="fixed bottom-28 right-8 px-4 py-2 rounded-full bg-primary flex gap-1 items-center justify-center">
          <Plus className="size-4 text-stone-800" />
          New Goal
        </DrawerTrigger>
        <DrawerContent className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[84%] mx-[-1px]">
          <DrawerHeader className="px-6 py-4">
            <DrawerTitle>Add a New Goal</DrawerTitle>
            <DrawerDescription>
              Set a new goal to help you stay focused and motivated.
            </DrawerDescription>
          </DrawerHeader>
          <section className="px-6 py-4 flex flex-col gap-6 overflow-auto">
            {/* Title */}
            <div className="flex flex-col-reverse w-full gap-2">
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title"
              />
              <Label htmlFor="title">Title</Label>
            </div>

            {/* Description */}
            <div className="flex flex-col-reverse w-full gap-2">
              <Input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Goal description"
              />
              <Label htmlFor="description">Description</Label>
            </div>

            {/* Category */}
            <div className="flex flex-col-reverse w-full gap-2">
              <Select
                value={category}
                onValueChange={(category) => setCategory(category)}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    category ? 'text-stone-800' : 'text-muted-foreground'
                  )}
                  id="category"
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="category">Category</Label>
            </div>

            {/* Period */}
            <div className="flex flex-col-reverse w-full gap-2">
              <Select
                value={timePeriod}
                onValueChange={(timePeriod) => setTimePeriod(timePeriod)}
              >
                <SelectTrigger
                  className={cn(
                    'w-full',
                    timePeriod ? 'text-stone-800' : 'text-muted-foreground'
                  )}
                  id="timePeriod"
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((timePeriod) => (
                    <SelectItem key={timePeriod} value={timePeriod}>
                      {timePeriod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label htmlFor="timePeriod">Time Period</Label>
            </div>

            {/* Tags */}
            <MultiSelect
              defaultOptions={tags}
              placeholder="Select or create your own tags"
              creatable
              onChange={(tags) => setTags(tags)}
            />
          </section>
          <DrawerFooter className="mb-6">
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  console.log('Adding goal');
                }}
              >
                Add Goal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AddGoal;
