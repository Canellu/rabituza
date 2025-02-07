'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { createOrUpdateGoal } from '@/lib/database/goals/createOrUpdateGoal';
import { cn } from '@/lib/utils';
import {
  splitGoalsByTimePeriod,
  TimePeriod,
  timePeriodToDates,
} from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { GoalStatus, GoalType } from '@/types/Goal';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import RequiredStar from './RequiredStar';

const categories = [
  'Health',
  'Personal Growth',
  'Relationships',
  'Travel',
  'Hobbies',
  'Finance',
  'Career',
  'Other',
];
const timePeriods = ['Year', 'Q1', 'Q2', 'Q3', 'Q4'];
const tagsList: Option[] = [
  { label: 'Fitness', value: 'Fitness' },
  { label: 'Learning', value: 'Learning' },
  { label: 'Mindfulness', value: 'Mindfulness' },
];

const AddGoal = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Option[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.Year);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.InProgress);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userId = getSession();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('User not logged in');
      }
      const { startDate, endDate } = timePeriodToDates(
        timePeriod,
        new Date().getFullYear()
      );

      // Get current goals to determine the next order
      const currentGoals =
        (await queryClient.getQueryData<GoalType[]>(['goals', userId])) || [];
      const periodGoals = currentGoals.filter((goal) => {
        const goalPeriod = splitGoalsByTimePeriod([goal])[timePeriod];
        return goalPeriod?.length > 0;
      });
      const nextOrder = periodGoals.length;

      const goalData: Omit<GoalType, 'id'> = {
        title,
        description,
        status,
        category,
        startDate,
        endDate,
        createdAt: new Date(),
        tags: tags.map((tag) => tag.value),
        order: nextOrder, // Add order field
      };

      await createOrUpdateGoal(userId, null, goalData);
    },
    onSuccess: () => {
      //Reset the form after successfully saving the goal
      setDialogOpen(false);
      setTitle('');
      setDescription('');
      setTags([]);
      setCategory('');
      setStatus(GoalStatus.InProgress);
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
    },
  });

  const handleSave = () => {
    console.log(error);
    if (!title || !category) {
      setError('Please fill in the required fields.');
      return;
    }
    setError(null);
    mutate(); // Trigger the mutation to save the goal
  };

  return (
    <>
      <Button variant="ghost" onClick={() => setDialogOpen((prev) => !prev)}>
        Add Goal
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
            <DialogDescription className="text-stone-600 text-sm">
              Set a new goal to help you stay focused and motivated.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 flex-grow">
            <div className="flex flex-col-reverse w-full gap-2">
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Goal title"
              />
              <Label htmlFor="title">
                Title
                <RequiredStar />
              </Label>
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
              <Label htmlFor="category">
                Category
                <RequiredStar />
              </Label>
            </div>

            {/* Tags */}
            <div className="flex flex-col-reverse w-full gap-2">
              <MultiSelect
                maxSelected={6}
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

            {/* Period */}
            <div className="flex flex-col-reverse w-full gap-2">
              <Select
                value={timePeriod}
                onValueChange={(timePeriod: TimePeriod) =>
                  setTimePeriod(timePeriod)
                }
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

            <div className="flex flex-col w-full gap-6">
              <p
                className={cn(
                  ' text-red-500 bg-red-100 rounded-md py-1 px-3 w-full text-center',
                  error ? 'block' : 'hidden'
                )}
              >
                {error}
              </p>

              {/* Save and Cancel buttons */}
              <div className="flex items-center justify-between w-full">
                <Button
                  onClick={() => setDialogOpen(false)}
                  variant="secondary"
                  disabled={!dialogOpen}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!dialogOpen}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddGoal;
