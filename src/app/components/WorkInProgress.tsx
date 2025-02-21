import { cn } from '@/lib/utils';

const WorkInProgress = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={cn(
        'border border-yellow-300 bg-yellow-100 text-yellow-800',
        'px-2 py-1 rounded-md max-w-max shadow-yellow-400/50',
        'text-center text-xs',
        className
      )}
    >
      Work in progress
    </div>
  );
};

export default WorkInProgress;
