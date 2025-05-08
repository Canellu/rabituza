import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const CardBadge = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'px-2 py-0.5 border flex items-center justify-center rounded-md ',
        'text-xs bg-stone-50 dark:bg-stone-600 dark:text-stone-200 font-medium text-stone-700 dark:border-transparent',
        className
      )}
    >
      {children}
    </div>
  );
};

export default CardBadge;
