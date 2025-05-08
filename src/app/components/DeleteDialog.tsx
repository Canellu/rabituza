import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog = ({ open, onClose, onConfirm }: DeleteDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-80 rounded-md">
      <DialogHeader>
        <DialogTitle className="text-stone-700 dark:text-stone-300">
          Delete Activity
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this activity? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-4 flex-row items-center justify-center">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" className="w-full" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DeleteDialog;
