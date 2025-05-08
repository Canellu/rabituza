'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HangboardEdgeType } from '@/types/Activity';
import { Plus, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import AnimateHeight from './AnimateHeight';

interface EdgeSelectorProps {
  edges: HangboardEdgeType[];
  setEdges: Dispatch<SetStateAction<HangboardEdgeType[]>>;
}

const DEFAULT_EDGE_SIZES = [10, 15, 20, 25, 35, 45];

const EdgeSelector = ({ edges, setEdges }: EdgeSelectorProps) => {
  const [selectedEdgeSize, setSelectedEdgeSize] = useState<number | ''>('');

  const addEdge = () => {
    if (selectedEdgeSize !== '') {
      setEdges((prev) => [
        ...prev,
        { size: selectedEdgeSize, sets: 0, reps: 0, weight: 0, duration: 0 },
      ]);
    }
  };

  const removeEdge = (index: number) => {
    setEdges((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEdge = (
    index: number,
    field: 'sets' | 'reps' | 'weight' | 'duration',
    value: string
  ) => {
    setEdges((prev) =>
      prev.map((edge, i) =>
        i === index
          ? { ...edge, [field]: value === '' ? '' : parseInt(value) }
          : edge
      )
    );
  };

  return (
    <div className="space-y-2">
      <Label>Edge Size (mm)</Label>
      <div className="flex gap-2">
        <ToggleGroup
          type="single"
          value={selectedEdgeSize ? selectedEdgeSize.toString() : ''}
          onValueChange={(value) => setSelectedEdgeSize(parseInt(value))}
          className="flex bg-stone-50 dark:bg-stone-800 dark:border-transparent border rounded-md p-1"
        >
          {DEFAULT_EDGE_SIZES.map((size) => (
            <ToggleGroupItem
              key={size}
              value={size.toString()}
              className="data-[state=on]:bg-stone-200 dark:data-[state=on]:bg-stone-700 h-7"
            >
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <Button size="icon" onClick={addEdge} disabled={!selectedEdgeSize}>
          <Plus />
        </Button>
      </div>

      <AnimateHeight isOpen={edges.length > 0}>
        <div className="space-y-4 bg-stone-50 dark:bg-stone-800 dark:border-transparent border p-4 rounded-md">
          {edges.map((edge, index) => (
            <div
              key={`edge-${index}`}
              className="flex gap-3 p-3 rounded-md flex-col bg-white dark:bg-stone-900 dark:border-transparent border"
            >
              <div className="flex justify-between items-center gap-2">
                {edge.size} mm
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => removeEdge(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="text-sm font-medium text-stone-700  dark:text-stone-400">
                    Sets
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={edge.sets}
                    onChange={(e) => updateEdge(index, 'sets', e.target.value)}
                    onFocus={(e) => (e.target.value = '')}
                    className="w-12 h-8 px-1.5"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="text-sm font-medium text-stone-700  dark:text-stone-400">
                    Reps
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={edge.reps}
                    onChange={(e) => updateEdge(index, 'reps', e.target.value)}
                    onFocus={(e) => (e.target.value = '')}
                    className="w-12 h-8 px-1.5"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="text-sm font-medium text-stone-700 dark:text-stone-400">
                    +kg
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={edge.weight}
                    onChange={(e) =>
                      updateEdge(index, 'weight', e.target.value)
                    }
                    onFocus={(e) => (e.target.value = '')}
                    className="w-12 h-8 px-1.5"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-1.5 items-center justify-end">
                <span className="text-sm font-medium text-stone-700  dark:text-stone-400">
                  Hang time per rep
                </span>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={edge.duration}
                    onChange={(e) =>
                      updateEdge(index, 'duration', e.target.value)
                    }
                    onFocus={(e) => (e.target.value = '')}
                    className="w-[72px] h-8 px-1.5 pr-9"
                    placeholder="0"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    sec
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default EdgeSelector;
