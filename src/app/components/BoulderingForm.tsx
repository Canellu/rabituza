'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BOULDERING_GYMS from '@/constants/boulderingGyms';
import { createActivity } from '@/lib/database/activities/createActivity';
import { cn } from '@/lib/utils';
import getGradeColor from '@/lib/utils/getGradeColor';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType, BoulderingData } from '@/types/Activity';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Clock,
  Loader2,
  MapPin,
  Minus,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import AnimateHeight from './AnimateHeight';

interface BoulderingFormProps {
  onClose: () => void;
}

const BoulderingForm = ({ onClose }: BoulderingFormProps) => {
  const userId = getSession();
  const queryClient = useQueryClient();
  const [selectedGym, setSelectedGym] = useState<
    keyof typeof BOULDERING_GYMS | ''
  >('');
  const [activityDate, setActivityDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState(
    activityDate.getHours().toString().padStart(2, '0')
  );
  const [selectedMinute, setSelectedMinute] = useState(
    activityDate.getMinutes().toString().padStart(2, '0')
  );
  const [gradeCount, setGradeCount] = useState<Record<string, number>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleGymChange = (value: keyof typeof BOULDERING_GYMS | '') => {
    setSelectedGym(value);
    setGradeCount({});
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: BoulderingData) => {
      if (!userId) throw new Error('User is not signed in');
      return createActivity(userId, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['activities', userId],
        exact: true,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
    },
  });

  const handleSubmit = async () => {
    if (!userId) return;

    const data = {
      type: ActivityType.Bouldering,
      gym: selectedGym,
      activityDate,
      grades: Object.entries(gradeCount)
        .filter(([_, count]) => count > 0)
        .map(([grade, count]) => ({
          grade,
          count,
        })),
    };

    mutate(data);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-4">
        <div className="space-y-1">
          <Button
            id="dob"
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal hover:bg-white text-base rounded-md',
              !activityDate && 'text-muted-foreground '
            )}
            onClick={() => setCalendarOpen((prev) => !prev)}
          >
            <CalendarIcon />
            {activityDate ? (
              format(activityDate, 'do MMMM yyyy, HH:mm')
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
          <AnimateHeight isOpen={calendarOpen}>
            <div className="border bg-stone-50 rounded-md p-4 space-y-4">
              <Calendar
                mode="single"
                weekStartsOn={1}
                selected={activityDate}
                onSelect={(date) => {
                  if (date) {
                    const newDate = new Date(date);
                    newDate.setHours(
                      parseInt(selectedHour),
                      parseInt(selectedMinute)
                    );
                    setActivityDate(newDate);
                    setCalendarOpen(false);
                  }
                }}
                classNames={{
                  head_row: 'flex space-x-1.5',
                  row: 'flex w-full mt-2 space-x-1.5',
                }}
                disabled={{ after: new Date() }}
                className="items-center flex w-full justify-center rounded-md border bg-white"
              />
              <div className="flex gap-2 items-center justfiy-center px-2">
                <Clock className="size-5" />
                <Select
                  value={selectedHour}
                  onValueChange={(value) => {
                    setSelectedHour(value);
                    const newDate = new Date(activityDate);
                    newDate.setHours(parseInt(value), parseInt(selectedMinute));
                    setActivityDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[65px] text-sm h-9">
                    <SelectValue>{selectedHour}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) =>
                      i.toString().padStart(2, '0')
                    ).map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {hour}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-sm font-medium">:</span>

                <Select
                  value={selectedMinute}
                  onValueChange={(value) => {
                    setSelectedMinute(value);
                    const newDate = new Date(activityDate);
                    newDate.setHours(parseInt(selectedHour), parseInt(value));
                    setActivityDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-[65px] text-sm h-9">
                    <SelectValue>{selectedMinute}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) =>
                      i.toString().padStart(2, '0')
                    ).map((minute) => (
                      <SelectItem key={minute} value={minute}>
                        {minute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AnimateHeight>
        </div>
      </div>

      <div className="space-y-4">
        <Select value={selectedGym} onValueChange={handleGymChange}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                <div className="flex items-center gap-2 px-1">
                  <MapPin className="mb-0.5 h-4 w-4" />
                  <span className="mt-0.5">Select Gym</span>
                </div>
              }
            />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(BOULDERING_GYMS).map(([key, gym]) => (
              <SelectItem key={key} value={key}>
                {gym.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AnimateHeight isOpen={!!selectedGym}>
          <div className="space-y-4">
            {selectedGym &&
              BOULDERING_GYMS[selectedGym].grades.map((grade) => (
                <div
                  key={grade}
                  className="flex items-center justify-between gap-16"
                >
                  <span
                    className={cn(
                      'font-medium text-md px-4 py-2 rounded-md w-full border',
                      getGradeColor(grade).text,
                      getGradeColor(grade).bg
                    )}
                  >
                    {grade.charAt(0).toUpperCase() + grade.slice(1)}
                  </span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setGradeCount((prev) => ({
                          ...prev,
                          [grade]: Math.max(0, (prev[grade] || 0) - 1),
                        }))
                      }
                      disabled={!gradeCount[grade]}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {gradeCount[grade] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setGradeCount((prev) => ({
                          ...prev,
                          [grade]: (prev[grade] || 0) + 1,
                        }))
                      }
                      disabled={
                        grade.toLowerCase().includes('slab') &&
                        gradeCount[grade] === 1
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </AnimateHeight>
      </div>

      <Button
        className="w-full mt-10"
        disabled={
          isPending ||
          !selectedGym ||
          Object.values(gradeCount).every((count) => count === 0)
        }
        onClick={handleSubmit}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save activity'
        )}
      </Button>
    </div>
  );
};

export default BoulderingForm;
