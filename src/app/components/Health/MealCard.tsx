'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CARD_ANIMATION_CONFIG } from '@/constants/animationConfig';
import { deleteNutrition } from '@/lib/database/nutrition/nutrients/deleteNutrition';
import { getSession } from '@/lib/utils/userSession';
import { Meal } from '@/types/Nutrition';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import CardBadge from '../CardBadge';

interface MealCardProps {
  meal: Meal;
}

const MealCard = ({ meal }: MealCardProps) => {
  const userId = getSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  // Calculate total nutrition values
  const totalCalories = meal.mealItems.reduce(
    (sum, item) => sum + item.calories,
    0
  );
  const totalCarbs = meal.mealItems.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = meal.mealItems.reduce(
    (sum, item) => sum + item.protein,
    0
  );
  const totalFat = meal.mealItems.reduce((sum, item) => sum + item.fat, 0);
  const totalFiber = meal.mealItems.reduce((sum, item) => sum + item.fiber, 0);

  const { mutate: deleteMeal } = useMutation({
    mutationFn: ({ userId, mealId }: { userId: string; mealId: string }) =>
      deleteNutrition(userId, mealId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrients', userId] });
    },
    onError: (error) => {
      console.error('Failed to delete meal:', error);
    },
  });

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (userId) deleteMeal({ userId, mealId: meal.id });
    setShowDeleteDialog(false);
  };

  // Define an array of nutrients to map over
  const nutrients = [
    { label: 'Carbs', value: totalCarbs },
    { label: 'Protein', value: totalProtein },
    { label: 'Fat', value: totalFat },
    { label: 'Fiber', value: totalFiber },
  ];

  return (
    <>
      <motion.div
        className="relative"
        {...CARD_ANIMATION_CONFIG}
        // onClick={onEdit} // Use onEdit prop to trigger edit mode
      >
        <div className="absolute inset-1 bg-red-500 rounded-xl flex items-center justify-end px-4">
          <Trash2 className="text-secondary" />
        </div>
        <motion.div
          className="border rounded-xl p-4 space-y-3 bg-white relative"
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: -250, right: 0 }}
          dragElastic={{ left: 0.5, right: 0 }}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -56 * 3) {
              handleDelete();
            }
          }}
        >
          <div className="flex items-start justify-between">
            <span className="font-medium first-letter:capitalize">
              {meal.mealType}
            </span>
            <CardBadge className="text-sm text-stone-600 whitespace-nowrap">
              {totalCalories} kcal
            </CardBadge>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="flex gap-1">
              {nutrients.map((nutrient) => (
                <div
                  key={nutrient.label}
                  className="space-x-1 text-[10px] rounded-full bg-stone-50 border px-2.5 py-1.5"
                >
                  <span className="text-stone-500">{nutrient.label}</span>
                  <span className="font-medium">
                    {nutrient.value > 0 ? `${nutrient.value}g` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-80 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-stone-700">Delete Meal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this meal? This action cannot be
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

export default MealCard;
