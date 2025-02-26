import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/hooks/useDebounce';
import useFoods from '@/lib/hooks/useFoods';
import { cn } from '@/lib/utils';
import { Food } from '@/types/Food';
import { Loader2, Search, X } from 'lucide-react';
import { useState } from 'react';

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
}: FoodSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [showNoResults, setShowNoResults] = useState(false);

  const { foods, isLoading } = useFoods();

  const handleSearch = useDebounce((searchTerm: string) => {
    setIsSearching(false);
    if (isLoading || !searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setShowNoResults(false);
      return;
    }

    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(Boolean);

    const searchWords = normalizeText(searchTerm);

    const matchedFoods = foods?.filter((food) => {
      const foodWords = normalizeText(food.foodName);
      const allKeywordWords = food.searchKeywords.flatMap(normalizeText);

      const combinedWords = [...foodWords, ...allKeywordWords];

      return searchWords.every((searchWord) =>
        combinedWords.includes(searchWord)
      );
    });

    setSearchResults(matchedFoods || []);
    setShowNoResults(true);
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
    <div className={cn()}>
      <div className="relative">
        <div className="flex items-center justify-center absolute top-0 left-0 h-full aspect-square">
          <Search className="size-4 text-stone-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange?.(e.target.value);
            if (e.target.value.length > 2) setIsSearching(true);
            handleSearch(e.target.value);
          }}
          className={cn('px-9')}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClear}
          className="absolute right-0 top-0 text-stone-400"
        >
          <X />
        </Button>
      </div>

      {value.length >= 2 &&
        !isSearching &&
        showNoResults &&
        searchResults.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground border bg-white rounded-md mt-1">
            No results found.
          </div>
        )}

      {(!!searchResults.length || (value.length >= 2 && isSearching)) && (
        <div className="max-h-[300px] overflow-y-auto border rounded-md mt-1 overscroll-contain relative">
          {isSearching && (
            <div
              className={cn(
                'p-2 text-sm text-muted-foreground flex items-center gap-2'
              )}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
          {searchResults.map((food) => (
            <div
              key={food.foodId}
              onClick={() => handleSelect(food)}
              className="p-2 cursor-pointer hover:bg-gray-100 select-none"
            >
              <div className="flex flex-col">
                <span>{food.foodName}</span>
                <span className="text-xs text-muted-foreground">
                  {food.calories?.quantity || 0} {food.calories?.unit || 'kcal'}{' '}
                  / 100g
                </span>
              </div>
            </div>
          ))}
          {!!searchResults.length && (
            <div className="px-2 py-1 text-xs text-muted-foreground sticky bottom-0 border-t bg-stone-50 w-full">
              {searchResults.length} result
              {searchResults.length > 1 ? 's' : ''} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
