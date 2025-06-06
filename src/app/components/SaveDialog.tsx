import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SaveDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SaveDialog = ({ open, onClose, onConfirm }: SaveDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent
      className="max-w-80 rounded-md"
      onInteractOutside={(e) => e.preventDefault()}
      hideCloseButton={true}
    >
      <DialogHeader>
        <DialogTitle className="text-stone-700 dark:text-stone-300">
          Save Recording
        </DialogTitle>
        <DialogDescription>
          Recording stopped, do you want to save the recorded session?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-4 flex-row items-center justify-center">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full" onClick={onConfirm}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default SaveDialog;
