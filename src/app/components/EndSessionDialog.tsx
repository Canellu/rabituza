import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EndSessionDialog {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const EndSessionDialog = ({ open, onClose, onConfirm }: EndSessionDialog) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent
      className="max-w-80 rounded-md"
      onInteractOutside={(e) => e.preventDefault()}
      hideCloseButton={true}
    >
      <DialogHeader>
        <DialogTitle className="text-stone-700">End Session</DialogTitle>
        <DialogDescription>
          Once session is ended, you can no longer record routes.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex gap-4 flex-row items-center justify-center">
        <Button variant="outline" className="w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full" onClick={onConfirm}>
          End
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default EndSessionDialog;
