import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';

export const hasDuration = (exerciseName: keyof typeof WORKOUT_EXERCISES) => {
  if (!WORKOUT_EXERCISES[exerciseName]) {
    return false;
  }

  return (
    'hasDuration' in WORKOUT_EXERCISES[exerciseName] &&
    WORKOUT_EXERCISES[exerciseName].hasDuration === true
  );
};
