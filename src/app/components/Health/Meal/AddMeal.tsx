'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Import Dialog components
import { useState } from 'react';
import MealForm from './MealForm';

const AddMeal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Add meal
      </Button>

      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>
          <MealForm onClose={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMeal;
