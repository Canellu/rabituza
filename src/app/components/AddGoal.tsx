'use client';

import { Dispatch, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultiSelect, { Option } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AnimateHeight from './AnimateHeight';

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

interface AddGoalProps {
  editable: boolean;
  setEditable: Dispatch<SetStateAction<boolean>>;
}

const AddGoal = ({ editable, setEditable }: AddGoalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Option[]>([]);
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  return (
    <AnimateHeight isOpen={editable}>
      <section className="px-6 py-4 flex flex-col items-center gap-4 overflow-auto bg-white border border-input rounded-md">
        <div className="flex flex-col gap-2 mb-5">
          <h2 className="text-lg font-semibold">Add a New Goal</h2>
          <p className="text-stone-600">
            Set a new goal to help you stay focused and motivated.
          </p>
        </div>

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
            <SelectContent className="z-[1000]">
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
            <SelectContent className="z-[1000]">
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
        <div className="flex flex-col-reverse w-full gap-2">
          <MultiSelect
            maxSelected={3}
            options={tagsList}
            value={tags}
            placeholder="Select or create your own tags"
            creatable
            onChange={(tags) => {
              setTags(tags);
            }}
          />
          <Label htmlFor="tags">Tags</Label>
        </div>

        {/* Save and Cancel buttons */}
        <div className="flex items-center justify-between mt-4 w-full">
          <Button
            onClick={() => setEditable(false)}
            variant="secondary"
            disabled={!editable}
          >
            Cancel
          </Button>
          <Button onClick={() => {}} disabled={!editable}>
            Save
          </Button>
        </div>
      </section>
    </AnimateHeight>
  );
};

export default AddGoal;
