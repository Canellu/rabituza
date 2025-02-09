export const CALISTHENICS_EXERCISES = {
  pushUp: 'Push-up',
  inclinePushUp: 'Incline Push-up',
  declinePushUp: 'Decline Push-up',
  kneePushUp: 'Knee Push-up',
  pullUp: 'Pull-up',
  dips: 'Dips',
  squats: 'Squats',
  squatVariation: 'Squat Variation',
  plank: 'Plank',
  sitUp: 'Sit-up',
  legRaises: 'Leg Raises',
  lunges: 'Lunges',
} as const;

export const POPULAR_EXERCISES: (keyof typeof CALISTHENICS_EXERCISES)[] = [
  'pushUp',
  'pullUp',
  'squats',
  'sitUp',
];
