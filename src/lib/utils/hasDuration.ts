import { GYM_EXERCISES } from '@/constants/gymExercises';

export const hasDuration = (exerciseName: keyof typeof GYM_EXERCISES) => {
  if (!GYM_EXERCISES[exerciseName]) {
    return false;
  }

  return (
    'hasDuration' in GYM_EXERCISES[exerciseName] &&
    GYM_EXERCISES[exerciseName].hasDuration === true
  );
};
