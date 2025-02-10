'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ActivityRatingsType } from '@/types/Activity';
import {
  Battery,
  Dumbbell,
  InfoIcon,
  LucideIcon,
  Smile,
  Star,
} from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AnimateHeight from '../AnimateHeight';

const RATING_CONFIG: Record<
  keyof ActivityRatingsType,
  {
    icon: LucideIcon;
    label: string;
    question: string;
    min: string;
    max: string;
  }
> = {
  intensity: {
    icon: Dumbbell,
    label: 'Intensity',
    question: 'How hard was the workout?',
    min: 'very easy',
    max: 'extremely hard',
  },
  energy: {
    icon: Battery,
    label: 'Energy Level',
    question: 'Physical/mental state',
    min: 'exhausted/sore',
    max: 'fresh/energetic',
  },
  enjoyment: {
    icon: Smile,
    label: 'Enjoyment',
    question: 'How fun/satisfying was it?',
    min: 'terrible',
    max: 'amazing',
  },
} as const;

function RatingDescription({
  question,
  min,
  max,
}: {
  question: string;
  min: string;
  max: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-stone-800 text-sm">{question}</span>
      <Separator />
      <div className="flex flex-col font-medium gap-1 text-stone-700 text-xs">
        <span>0: {min}</span>
        <span>10: {max}</span>
      </div>
    </div>
  );
}

interface ActivityRatingsProps {
  ratings: ActivityRatingsType;
  onChange: (ratings: ActivityRatingsType) => void;
}

export function ActivityRatings({ ratings, onChange }: ActivityRatingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange =
    (field: keyof ActivityRatingsType) => (value: number[]) => {
      onChange({
        ...ratings,
        [field]: value[0],
      });
    };

  return (
    <div>
      <Button
        variant="outline"
        className={cn(
          'w-full justify-between text-left font-normal text-base rounded-md',
          isOpen && 'bg-stone-50'
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <Star className="mb-0.5" />
          Activity Ratings
        </div>
        {!isOpen && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="size-3.5 text-emerald-600" />
              <span>{ratings.intensity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Battery className="size-3.5 text-emerald-600" />
              <span>{ratings.energy}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smile className="size-3.5 text-emerald-600" />
              <span>{ratings.enjoyment}</span>
            </div>
          </div>
        )}
      </Button>

      <AnimateHeight isOpen={isOpen} marginBottom={16}>
        <div
          className={cn('space-y-5 bg-stone-50 border p-4 pb-6 rounded-md ')}
        >
          {(
            Object.entries(RATING_CONFIG) as [
              keyof ActivityRatingsType,
              (typeof RATING_CONFIG)[keyof ActivityRatingsType]
            ][]
          ).map(([key, config]) => (
            <RatingItem
              description={
                <RatingDescription
                  question={config.question}
                  min={config.min}
                  max={config.max}
                />
              }
              key={config.label}
              {...config}
              value={ratings[key]}
              onChange={handleChange(key)}
            />
          ))}
        </div>
      </AnimateHeight>
    </div>
  );
}

interface RatingLabelProps {
  icon: LucideIcon;
  label: string;
}

function RatingLabel({ icon: Icon, label }: RatingLabelProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-emerald-600" />
      <span className="">{label}</span>
    </div>
  );
}

interface RatingValueProps {
  value: number;
}

function RatingValue({ value }: RatingValueProps) {
  return (
    <span className="text-sm font-medium rounded-md bg-white size-6 border grid place-items-center">
      {value}
    </span>
  );
}

interface RatingItemProps {
  icon: LucideIcon;
  label: string;
  value: number;
  onChange: (value: number[]) => void;
  description: ReactNode;
}

function RatingItem({
  icon,
  label,
  value,
  onChange,
  question,
  min,
  max,
}: RatingItemProps & { question: string; min: string; max: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RatingLabel icon={icon} label={label} />
          <Popover>
            <PopoverTrigger>
              <InfoIcon className="size-4 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className="p-3 max-w-max">
              <RatingDescription question={question} min={min} max={max} />
            </PopoverContent>
          </Popover>
        </div>
        <RatingValue value={value} />
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={10}
        step={1}
        className="w-full"
      />
    </div>
  );
}
