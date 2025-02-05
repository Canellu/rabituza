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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';
import AnimateHeight from './AnimateHeight';

interface ActivityDateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const ActivityDateTimePicker = ({
  date,
  onDateChange,
}: ActivityDateTimePickerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    date.getHours().toString().padStart(2, '0')
  );
  const [selectedMinute, setSelectedMinute] = useState(
    date.getMinutes().toString().padStart(2, '0')
  );

  const updateDateTime = (
    newDate: Date | undefined = undefined,
    hour: string = selectedHour,
    minute: string = selectedMinute
  ) => {
    const updatedDate = new Date(newDate || date);
    updatedDate.setHours(parseInt(hour), parseInt(minute));
    onDateChange(updatedDate);
  };

  return (
    <div>
      <Button
        variant={'outline'}
        className={cn(
          'w-full justify-start text-left font-normal text-base rounded-md',
          !date && 'text-muted-foreground',
          calendarOpen && 'bg-stone-50'
        )}
        onClick={() => setCalendarOpen((prev) => !prev)}
      >
        <CalendarIcon className="mb-0.5" />
        {format(date, 'do MMMM yyyy, HH:mm')}
      </Button>
      <AnimateHeight isOpen={calendarOpen} marginBottom={16}>
        <div className="border bg-stone-50 rounded-md p-4 space-y-4">
          <Calendar
            mode="single"
            weekStartsOn={1}
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                updateDateTime(newDate);
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
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center justfiy-between">
              <Clock className="size-5" />
              <Select
                value={selectedHour}
                onValueChange={(value) => {
                  setSelectedHour(value);
                  updateDateTime(undefined, value);
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
                  updateDateTime(undefined, selectedHour, value);
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCalendarOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default ActivityDateTimePicker;
