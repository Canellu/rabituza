import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDebounce } from '@/lib/hooks/useDebounce';
import useFoods from '@/lib/hooks/useFoods';
import { cn } from '@/lib/utils';
import { Food } from '@/types/Food';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FoodSearchProps {
  value: string;
  onSelect: (food: Food) => void;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export const FoodSearch = ({
  placeholder = 'Search foods...',
  value,
  onChange,
  onSelect,
  onClear,
  className = '',
}: FoodSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [showNoResults, setShowNoResults] = useState(false); // Add this state

  const { foods, isLoading } = useFoods();
  const commandListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commandListRef.current) {
      commandListRef.current.scrollTop = 0;
    }
  }, [searchResults]);

  const handleSearch = useDebounce((searchTerm: string) => {
    setIsSearching(false);
    if (isLoading || !searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setShowNoResults(false); // Hide no results message
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const searchWords = searchTermLower.split(/[\s,]+/).filter(Boolean);

    const matchedFoods = foods?.filter((food) => {
      const foodWords = food.foodName
        .toLowerCase()
        .split(/[\s,]+/)
        .filter(Boolean);
      const nameMatch = searchWords.some((searchWord) =>
        foodWords.some((foodWord) => foodWord.startsWith(searchWord))
      );

      const keywordMatch = food.searchKeywords.some((keyword) => {
        const keywordWords = keyword
          .toLowerCase()
          .split(/[\s,]+/)
          .filter(Boolean);
        return searchWords.some((searchWord) =>
          keywordWords.some((keywordWord) => keywordWord.startsWith(searchWord))
        );
      });

      return nameMatch || keywordMatch;
    });

    setSearchResults(matchedFoods || []);
    setShowNoResults(true); // Show no results message only after search
  }, 300);

  const handleClear = () => {
    setSearchResults([]);
    setShowNoResults(false);
    onClear?.();
  };
  const handleSelect = (food: Food) => {
    setSearchResults([]);
    setShowNoResults(false);
    onSelect(food);
  };

  return (
    <Command
      className={cn(
        'rounded-md border',
        '[&_[cmdk-input-wrapper]]:pr-1',
        'outline outline-2 outline-transparent outline-offset-2',
        ' focus-within:outline-lime-400',
        !isSearching && !showNoResults && '[&_[cmdk-input-wrapper]]:border-b-0',
        className
      )}
    >
      <CommandInput
        placeholder={placeholder}
        value={value}
        onValueChange={(newValue) => {
          onChange?.(newValue);
          if (value.length > 2) setIsSearching(true);
          handleSearch(newValue);
        }}
        clearButton={!!value}
        onClear={() => {
          handleClear();
        }}
        className="text-base"
      />

      <CommandList
        ref={commandListRef}
        className="max-h-[200px] overflow-y-auto"
      >
        {isSearching && (
          <div className="p-2 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Searching...</span>
          </div>
        )}
        {value.length >= 2 &&
          searchResults !== undefined &&
          !isSearching &&
          showNoResults &&
          searchResults.length === 0 && (
            <CommandEmpty className="p-2 text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>
          )}
        {searchResults && searchResults.length > 0 && (
          <CommandGroup>
            {searchResults.map((food) => (
              <CommandItem
                key={food.foodId}
                value={food.foodName}
                onSelect={() => handleSelect(food)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === food.foodName ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex flex-col">
                  <span>{food.foodName}</span>
                  <span className="text-xs text-muted-foreground">
                    {food.calories?.quantity || 0}{' '}
                    {food.calories?.unit || 'kcal'} / 100g
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
};
