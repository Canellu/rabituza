'use client';

import WorkInProgress from '@/app/components/WorkInProgress';
import { Button } from '@/components/ui/button';
import { Tab } from '@/constants/menu';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FeedbackPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Button
        size="icon"
        variant="outline"
        asChild
        className="absolute left-4 top-4"
      >
        <Link href={`/?tab=${Tab.Profile}`} replace>
          <ArrowLeft />
        </Link>
      </Button>
      <WorkInProgress />
    </div>
  );
};

export default FeedbackPage;
