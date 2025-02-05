'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BOULDERING_GYMS from '@/constants/boulderingGyms';
import { cn } from '@/lib/utils';
import getGradeColor from '@/lib/utils/getGradeColor';
import { MapPin, Minus, Plus } from 'lucide-react';
import AnimateHeight from './AnimateHeight';

interface BoulderingGradeSelectorProps {
  gradeCount: Record<string, number>;
  selectedGym: keyof typeof BOULDERING_GYMS | '';
  onGymChange: (gym: keyof typeof BOULDERING_GYMS | '') => void;
  onGradeCountChange: (gradeCount: Record<string, number>) => void;
}

export function BoulderingGradeSelector({
  gradeCount,
  selectedGym,
  onGymChange,
  onGradeCountChange,
}: BoulderingGradeSelectorProps) {
  return (
    <div className="space-y-2">
      <Select value={selectedGym} onValueChange={onGymChange}>
        <SelectTrigger className={cn(selectedGym ? 'bg-stone-50' : 'bg-white')}>
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
        <div className="space-y-4 border bg-stone-50 p-4 rounded-md">
          {selectedGym &&
            BOULDERING_GYMS[selectedGym].grades.map((grade) => (
              <div
                key={grade}
                className="flex items-center justify-between gap-16"
              >
                <span
                  className={cn(
                    'font-medium text-md px-3 py-1.5 rounded-lg w-full border',
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
                      onGradeCountChange({
                        ...gradeCount,
                        [grade]: Math.max(0, (gradeCount[grade] || 0) - 1),
                      })
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
                      onGradeCountChange({
                        ...gradeCount,
                        [grade]: (gradeCount[grade] || 0) + 1,
                      })
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
  );
}
