'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveActivityButtonProps {
  isPending: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const SaveActivityButton = ({
  isPending,
  isDisabled,
  onClick,
}: SaveActivityButtonProps) => {
  return (
    <Button
      className="w-full mt-10"
      disabled={isPending || isDisabled}
      onClick={onClick}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save activity'
      )}
    </Button>
  );
};

export default SaveActivityButton;