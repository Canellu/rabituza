'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useState } from 'react';
import GoalForm from './GoalForm';

const AddGoal = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setDialogOpen((prev) => !prev)}>
        Add Goal
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle>Add a New Goal</DialogTitle>
            <DialogDescription className="sr-only">Goal Form</DialogDescription>
          </DialogHeader>
          <GoalForm onClose={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddGoal;
