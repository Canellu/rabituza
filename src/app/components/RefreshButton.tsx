'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RefreshButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.refresh();
    }, 500);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  return (
    <Button onClick={handleRefresh} size="icon" variant="secondary">
      <RefreshCw className={isLoading ? 'animate-spin' : ''} />
    </Button>
  );
};

export default RefreshButton;
