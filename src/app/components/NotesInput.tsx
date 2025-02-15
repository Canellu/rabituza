'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ActivityNotesProps {
  note: string;
  onNoteChange: (value: string) => void;
}

const NotesInput = ({ note, onNoteChange }: ActivityNotesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="activity-notes" className="text-sm">
        Notes
      </Label>
      <Textarea
        id="activity-notes"
        placeholder="Add notes (optional)"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        rows={6}
      />
    </div>
  );
};

export default NotesInput;
