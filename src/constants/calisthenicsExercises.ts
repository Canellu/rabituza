export const CALISTHENICS_EXERCISE_GROUPS = {
  UPPER_BODY: 'Upper Body',
  LOWER_BODY: 'Lower Body',
  CORE: 'Core',
} as const;

export const CALISTHENICS_EXERCISES = {
  backExtenstion: {
    name: 'Back Extension',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
    hasDuration: true,
  },
  deadhang: {
    name: 'Deadhang',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
    hasDuration: true,
  },
  handstand: {
    name: 'Handstand',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
    hasDuration: true,
  },
  pullUp: {
    name: 'Pull-up',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  pushUp: {
    name: 'Push-up',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  inclinePushUp: {
    name: 'Incline Push-up',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  declinePushUp: {
    name: 'Decline Push-up',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  kneePushUp: {
    name: 'Knee Push-up',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  dip: {
    name: 'Dip',
    group: CALISTHENICS_EXERCISE_GROUPS.UPPER_BODY,
  },
  squat: {
    name: 'Squat',
    group: CALISTHENICS_EXERCISE_GROUPS.LOWER_BODY,
  },
  jumpSquat: {
    name: 'Jump Squat',
    group: CALISTHENICS_EXERCISE_GROUPS.LOWER_BODY,
  },
  splitSquat: {
    name: 'Split Squat',
    group: CALISTHENICS_EXERCISE_GROUPS.LOWER_BODY,
  },
  pistolSquat: {
    name: 'Pistol Squat',
    group: CALISTHENICS_EXERCISE_GROUPS.LOWER_BODY,
  },
  lunges: {
    name: 'Lunges',
    group: CALISTHENICS_EXERCISE_GROUPS.LOWER_BODY,
  },
  plank: {
    name: 'Plank',
    group: CALISTHENICS_EXERCISE_GROUPS.CORE,
    hasDuration: true,
  },
  lSit: {
    name: 'L-Sit',
    group: CALISTHENICS_EXERCISE_GROUPS.CORE,
    hasDuration: true,
  },
  sitUp: {
    name: 'Sit-up',
    group: CALISTHENICS_EXERCISE_GROUPS.CORE,
  },
  legRaises: {
    name: 'Leg Raises',
    group: CALISTHENICS_EXERCISE_GROUPS.CORE,
  },
} as const;

export const POPULAR_EXERCISES = [
  'pullUp',
  'deadhang',
  'backExtenstion',
  'pushUp',
  'squat',
  'sitUp',
] as const;
