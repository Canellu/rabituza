import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DELETE_DRAG_THRESHOLD } from '@/constants/deleteDragThreshold';
import { cn } from '@/lib/utils';
import { GoalStatus, GoalType } from '@/types/Goal';
import { motion } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: GoalType;
  isOrdering: boolean;
  draggingId: string | null;
  deleteGoal: () => void;
  onCheck?: (goal: GoalType) => void;
  onEdit?: () => void;
}

const GoalCard = ({
  goal,
  isOrdering,
  deleteGoal,
  onCheck,
  onEdit,
}: GoalCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteGoal();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        className="relative"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4">
          <Trash2 className="text-white" />
        </div>
        <motion.div
          className={cn(
            'bg-gradient-to-tr',
            goal.status === GoalStatus.Completed
              ? ' from-emerald-100 to-emerald-500 shadow-md ring-transparent dark:from-emerald-800 dark:to-emerald-950'
              : 'bg-white dark:bg-stone-800 ring-stone-200 dark:ring-transparent',
            'rounded-xl p-5 ring-1 flex flex-row gap-3 items-center w-full',
            'relative',
            isOrdering ? 'pl-3' : 'pl-5'
          )}
          drag={!isOrdering ? 'x' : false}
          dragDirectionLock
          whileDrag={{ cursor: 'grabbing' }}
          dragConstraints={{ left: -250, right: 0 }}
          dragSnapToOrigin
          dragElastic={{ left: 0.5, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < DELETE_DRAG_THRESHOLD) {
              handleDelete();
            }
          }}
          onClick={() => onEdit && onEdit()}
        >
          <GripVertical
            className={cn(
              'size-5 text-stone-500',
              isOrdering ? 'block' : 'hidden'
            )}
          />
          <div className="flex-grow">
            <h2 className="text-lg font-semibold capitalize text-stone-800 dark:text-stone-200">
              {goal.title}
            </h2>
            <p className="text-stone-700 dark:text-stone-300 text-sm">
              {goal.description}
            </p>
            <p
              className={cn(
                'text-stone-600 text-xs mt-1 italic',
                goal.status === GoalStatus.Completed
                  ? 'dark:text-stone-400'
                  : 'dark:text-stone-500'
              )}
            >
              Category: {goal.category}
            </p>
            {goal.tags && goal.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {goal.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      ' text-stone-700 dark:text-stone-300 border text-xs px-2 py-1 rounded-full dark:border-stone-600/70',
                      goal.status === GoalStatus.Completed
                        ? 'bg-white/30 backdrop-blur-sm border-white/20 dark:bg-black/10'
                        : 'bg-secondary text-stone-700'
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {onCheck && (
            <Checkbox
              className={cn(
                'size-5 bg-white dark:bg-stone-900',
                'data-[state=checked]:bg-emerald-100 data-[state=checked]:text-emerald-700 data-[state=checked]:border-emerald-100',
                'dark:data-[state=checked]:border-transparent dark:data-[state=checked]:bg-emerald-800 dark:data-[state=checked]:text-emerald-400'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onCheck(goal);
              }}
              checked={goal.status === GoalStatus.Completed}
            />
          )}
        </motion.div>
      </motion.div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-80 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-stone-700">Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-4 flex-row items-center justify-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalCard;
