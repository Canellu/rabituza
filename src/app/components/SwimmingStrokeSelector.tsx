'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SWIMMING_STROKES,
  SwimmingStrokeKey,
} from '@/constants/swimmingStrokes';
import { SwimmingStrokeItem } from '@/types/Activity';
import { Loader2, Search, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import SelectedStrokesList from './SelectedStrokesList';

interface SwimmingStrokeSelectorProps {
  strokes: SwimmingStrokeItem[];
  setStrokes: Dispatch<SetStateAction<SwimmingStrokeItem[]>>;
}

const SwimmingStrokeSelector = ({
  strokes,
  setStrokes,
}: SwimmingStrokeSelectorProps) => {
  const strokeEntries = Object.entries(SWIMMING_STROKES);

  const [searchResults, setSearchResults] = useState(strokeEntries);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setIsSearching(false);
    const normalized = searchTerm.toLowerCase().split(/[\s-]+/);

    const matches = strokeEntries.filter(([, val]) => {
      const name = val.name.toLowerCase();
      const category = val.category.toLowerCase();
      const difficulty = (
        'difficulty' in val ? val.difficulty : ''
      ).toLowerCase();
      const focus =
        'focus' in val ? val.focus?.map((f) => f.toLowerCase()).join(' ') : '';
      return normalized.every((term) =>
        [name, category, difficulty, focus].some((field) =>
          field.includes(term)
        )
      );
    });

    setSearchResults(matches);
  };

  const handleClear = () => {
    setSearchText('');
    setSearchResults(strokeEntries);
  };

  const handleSelect = (strokeKey: SwimmingStrokeKey) => {
    // Find stroke to check if it's drill (might have duration) or not
    const stroke = SWIMMING_STROKES[strokeKey];
    const isDrill = stroke.category === 'Drill';

    setStrokes((prev) => [
      {
        name: strokeKey,
        sets: '',
        ...(isDrill ? { duration: '' } : { reps: '' }),
      },
      ...prev,
    ]);
    handleClear();
  };

  return (
    <div>
      <div className="relative">
        <div className="flex items-center justify-center absolute top-0 left-0 h-full aspect-square">
          <Search className="size-4 text-stone-400" />
        </div>
        <Input
          type="text"
          placeholder="Search & add swimming strokes"
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);
            if (value.length > 2) setIsSearching(true);
            handleSearch(value);
          }}
          className="px-9 dark:focus-within:!bg-stone-800"
        />
        {searchText && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className="absolute right-0 top-0 text-stone-400"
          >
            <X />
          </Button>
        )}
      </div>

      <div className="max-h-[270px] overflow-y-auto border rounded-md mt-1 overscroll-contain relative dark:border-transparent dark:bg-stone-900 bg-white">
        {isSearching && (
          <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {searchResults.map(([key, stroke]) => (
          <div
            key={key}
            onClick={() => handleSelect(key as SwimmingStrokeKey)}
            className="p-2 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 select-none"
          >
            <div className="flex flex-col">
              <span className="dark:text-stone-200">{stroke.name}</span>
              <span className="text-xs text-stone-400">
                {stroke.category}
                {'difficulty' in stroke ? ` • ${stroke.difficulty}` : ''}
                {'focus' in stroke && stroke.focus
                  ? ` • ${stroke.focus.join(', ')}`
                  : ''}
              </span>
            </div>
          </div>
        ))}
        {!!searchResults.length && (
          <div className="px-2 py-1 text-xs text-muted-foreground sticky bottom-0 border-t bg-stone-50 w-full dark:bg-stone-800 dark:border-t-stone-600">
            {searchResults.length} result{searchResults.length > 1 ? 's' : ''}{' '}
            found
          </div>
        )}
      </div>

      {strokes.length > 0 && (
        <SelectedStrokesList strokes={strokes} setStrokes={setStrokes} />
      )}
    </div>
  );
};

export default SwimmingStrokeSelector;
