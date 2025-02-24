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
import { createOrUpdateGoal } from '@/lib/database/goals/createOrUpdateGoal';
import { cn } from '@/lib/utils';
import {
  datesToTimePeriod,
  splitGoalsByTimePeriod,
  TimePeriod,
  timePeriodToDates,
} from '@/lib/utils/timePeriod';
import { getSession } from '@/lib/utils/userSession';
import { GoalStatus, GoalType } from '@/types/Goal';
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

interface GoalFormProps {
  initialGoal?: GoalType;
  onClose: () => void;
}

const GoalForm = ({ initialGoal, onClose }: GoalFormProps) => {
  const [title, setTitle] = useState(initialGoal?.title || '');
  const [description, setDescription] = useState(
    initialGoal?.description || ''
  );
  const [tags, setTags] = useState<Option[]>(
    initialGoal?.tags?.map((tag) => ({ label: tag, value: tag })) || []
  );
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(
    (initialGoal?.startDate &&
      initialGoal?.endDate &&
      datesToTimePeriod(initialGoal?.startDate, initialGoal?.endDate)) ||
      TimePeriod.Year
  );
  const [category, setCategory] = useState(initialGoal?.category || '');
  const [status, setStatus] = useState<GoalStatus>(
    initialGoal?.status || GoalStatus.InProgress
  );
  const [error, setError] = useState<string | null>(null);

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
        order: nextOrder,
      };

      await createOrUpdateGoal(userId, initialGoal?.id || null, goalData);
    },
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setTags([]);
      setCategory('');
      setStatus(GoalStatus.InProgress);
      queryClient.invalidateQueries({ queryKey: ['goals', userId] });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating goal:', error);
    },
  });

  const handleSave = () => {
    if (!title || !category) {
      setError('Please fill in the required fields.');
      return;
    }
    setError(null);
    mutate();
  };

  return (
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

      <div className="flex flex-col-reverse w-full gap-2">
        <Select
          value={timePeriod}
          onValueChange={(timePeriod: TimePeriod) => setTimePeriod(timePeriod)}
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

      <p
        className={cn(
          ' text-red-500 bg-red-100 rounded-md py-1 px-3 w-full text-center',
          error ? 'block' : 'hidden'
        )}
      >
        {error}
      </p>

      <div className="flex items-center justify-between w-full">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default GoalForm;
