'use client';

import WorkInProgress from '@/app/components/WorkInProgress';
import { Button } from '@/components/ui/button';
import { Tab } from '@/constants/menu';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

const FeedbackPage = () => {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      toast('backswiped');
      console.log('Back swipe detected', event);
    };

    // Listen for the popstate event
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Button
        size="icon"
        variant="outline"
        asChild
        className="absolute left-4 top-4"
      >
        <Link href={`/?tab=${Tab.Profile}`}>
          <ArrowLeft />
        </Link>
      </Button>
      <WorkInProgress />
    </div>
  );
};

export default FeedbackPage;
