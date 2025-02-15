import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDialog = ({ open, onClose, onConfirm }: ResetDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-80 rounded-md">
      <DialogHeader>
        <DialogTitle className="text-stone-700">Reset Recording</DialogTitle>
        <DialogDescription className="flex flex-col gap-1">
          <span>Recorded data will be discarded.</span>
          <span>Are you sure you want to reset the recording?</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-4 flex-row items-center justify-center">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" className="w-full" onClick={onConfirm}>
          Reset
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ResetDialog;