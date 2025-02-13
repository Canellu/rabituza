import { Food } from '@/types/Food';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getAllFoodsFromDB, loadChunkedFoodsFromFiles } from '../idb/idb';

const useFoods = () => {
  const queryClient = useQueryClient();
  const [hasLoadedFiles, setHasLoadedFiles] = useState(false);

  // Fetch foods from IndexedDB
  const {
    data: foods,
    isFetched,
    isLoading,
    isError,
    error,
  } = useQuery<Food[], Error>({
    queryKey: ['foods'],
    queryFn: getAllFoodsFromDB,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // Prevents unnecessary re-fetching
  });

  useEffect(() => {
    const loadDataIfNeeded = async () => {
      if (isFetched && foods?.length === 0 && !hasLoadedFiles) {
        console.log('📂 No foods in DB, loading from chunked files...');
        setHasLoadedFiles(true); // Prevents multiple calls
        try {
          await loadChunkedFoodsFromFiles();
          queryClient.invalidateQueries({ queryKey: ['foods'] }); // Re-fetch after loading
        } catch (err) {
          console.error('❌ Error loading chunked foods:', err);
        }
      }
    };

    loadDataIfNeeded();
  }, [isFetched, foods, queryClient, hasLoadedFiles]);

  return { foods, isFetched, isLoading, isError, error };
};

export default useFoods;
