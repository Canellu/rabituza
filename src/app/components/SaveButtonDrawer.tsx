'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SaveActivityButtonProps {
  title?: string;
  isPending: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const SaveButtonDrawer = ({
  title = 'Save Activity',
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
        title
      )}
    </Button>
  );
};

export default SaveButtonDrawer;
