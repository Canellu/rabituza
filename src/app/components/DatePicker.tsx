'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { addYears, endOfYear, format, getYear, startOfYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import AnimateHeight from './AnimateHeight';

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
  disabledDays?: {
    before?: Date;
    after?: Date;
  };
}

const DatePicker = ({ date, onDateChange, disabledDays }: DatePickerProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const currentYear = getYear(new Date());
  const startOfCurrentYear = startOfYear(new Date(currentYear, 0, 1));
  const endOfCurrentYear = endOfYear(new Date(currentYear, 11, 31));

  return (
    <div className="w-full">
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
        {date ? format(date, 'do MMMM yyyy') : 'Select a date'}
      </Button>
      <AnimateHeight isOpen={calendarOpen} marginBottom={16}>
        <div className="border bg-stone-50 rounded-md p-4 space-y-4">
          <Calendar
            mode="single"
            weekStartsOn={1}
            selected={date}
            onSelect={(newDate) => {
              setCalendarOpen(false);
              if (newDate) {
                onDateChange(newDate);
              }
            }}
            classNames={{
              head_row: 'flex space-x-1.5',
              row: 'flex w-full mt-2 space-x-1.5',
            }}
            fromMonth={startOfCurrentYear}
            toMonth={endOfCurrentYear}
            disabled={
              disabledDays
                ? {
                    before: disabledDays.before ?? new Date(0),
                    after: disabledDays.after ?? addYears(new Date(), 1000),
                  }
                : undefined
            }
            className="items-center flex w-full justify-center rounded-md border bg-white"
          />
        </div>
      </AnimateHeight>
    </div>
  );
};

export default DatePicker;
