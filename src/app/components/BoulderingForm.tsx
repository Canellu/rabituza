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
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const BoulderingForm = () => {
  const [selectedGym, setSelectedGym] = useState<
    keyof typeof BOULDERING_GYMS | ''
  >('');
  const [gradeCount, setGradeCount] = useState<Record<string, number>>({});

  const handleGymChange = (value: keyof typeof BOULDERING_GYMS | '') => {
    setSelectedGym(value);
    setGradeCount({}); // Reset counts when gym changes
  };

  const handleSubmit = () => {
    const data = {
      gym: selectedGym,
      grades: Object.entries(gradeCount)
        .filter(([_, count]) => count > 0)
        .map(([grade, count]) => ({
          grade,
          count,
        })),
      timestamp: new Date().toISOString(),
    };
    console.log('Data to be submitted:', data);
  };

  return (
    <div className="space-y-4">
      <Select value={selectedGym} onValueChange={handleGymChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a gym" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BOULDERING_GYMS).map(([key, gym]) => (
            <SelectItem key={key} value={key}>
              {gym.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedGym && (
        <div className="space-y-5">
          {BOULDERING_GYMS[selectedGym].grades.map((grade) => (
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

          <div className="pt-8">
            <Button
              className="w-full"
              disabled={
                !selectedGym ||
                Object.values(gradeCount).every((count) => count === 0)
              }
              onClick={handleSubmit}
            >
              Save activity
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoulderingForm;
