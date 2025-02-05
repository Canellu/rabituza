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
import { Goal, GoalStatus } from '@/types/Goal';
import { motion, PanInfo } from 'framer-motion';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalCardProps {
  goal: Goal;
  isOrdering: boolean;
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: (info: PanInfo, goal: Goal) => void;
  onCheck: (goal: Goal) => void;
}

const GoalCard = ({
  goal,
  isOrdering,
  onDragStart,
  onDragEnd,
  onCheck,
}: GoalCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDragEnd({ offset: { x: DELETE_DRAG_THRESHOLD, y: 0 } } as PanInfo, goal);
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
        <div className="absolute inset-1 bg-red-500 rounded-lg flex items-center justify-end px-4">
          <Trash2 className="text-secondary" />
        </div>
        <motion.div
          className={cn(
            `${
              goal.status === GoalStatus.Completed
                ? 'bg-primary shadow-none'
                : 'bg-secondary shadow-sm'
            }`,
            'rounded-lg p-5 border flex flex-row gap-3 items-center w-full transition-colors duration-200 ease-in-out',
            'relative',
            isOrdering ? 'pl-3' : 'pl-5'
          )}
          drag={!isOrdering ? 'x' : false}
          dragDirectionLock
          whileDrag={{ cursor: 'grabbing' }}
          dragConstraints={{ left: -250, right: 0 }}
          dragSnapToOrigin
          dragElastic={{ left: 0.5, right: 0 }}
          onDragStart={() => onDragStart(goal.id!)}
          onDragEnd={(_, info) => {
            if (info.offset.x < -56 * 3) {
              handleDelete();
            }
          }}
          onClick={() => onCheck(goal)}
        >
          <GripVertical
            className={cn(
              'size-5 text-stone-400',
              isOrdering ? 'block' : 'hidden'
            )}
          />
          <div className="flex-grow">
            <h2 className="text-lg font-semibold capitalize">{goal.title}</h2>
            <p className="text-stone-600 text-sm">{goal.description}</p>
          </div>
          <Checkbox
            className={cn(
              'size-5 bg-white',
              'data-[state=checked]:bg-secondary'
            )}
            checked={goal.status === GoalStatus.Completed}
          />
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
