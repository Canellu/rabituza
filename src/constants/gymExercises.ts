export const GYM_EXERCISE_GROUPS = {
  PUSH: 'Upper Body - Push',
  PULL: 'Upper Body - Pull',
  LOWER: 'Lower Body',
  CORE: 'Core',
  CARDIO: 'Cardio',
} as const;

export const GYM_EXERCISES = {
  // Push
  benchPress: { name: 'Bench Press', group: GYM_EXERCISE_GROUPS.PUSH },
  inclineBenchPress: {
    name: 'Incline Bench Press',
    group: GYM_EXERCISE_GROUPS.PUSH,
  },
  shoulderPress: { name: 'Shoulder Press', group: GYM_EXERCISE_GROUPS.PUSH },
  tricepExtension: {
    name: 'Tricep Extension',
    group: GYM_EXERCISE_GROUPS.PUSH,
  },
  lateralRaise: { name: 'Lateral Raise', group: GYM_EXERCISE_GROUPS.PUSH },
  dumbbellInclineBenchPress: {
    name: 'Dumbbell Incline Bench Press',
    group: GYM_EXERCISE_GROUPS.PUSH,
  },
  tricepRingExtension: {
    name: 'Tricep Ring Extension',
    group: GYM_EXERCISE_GROUPS.PUSH,
  },
  dips: { name: 'Dips', group: GYM_EXERCISE_GROUPS.PUSH },

  // Pull
  latPulldown: { name: 'Lat Pulldown', group: GYM_EXERCISE_GROUPS.PULL },
  seatedRow: { name: 'Seated Row', group: GYM_EXERCISE_GROUPS.PULL },
  bicepCurl: { name: 'Bicep Curl', group: GYM_EXERCISE_GROUPS.PULL },
  hammerCurl: { name: 'Hammer Curl', group: GYM_EXERCISE_GROUPS.PULL },
  chestSupportedRow: {
    name: 'Chest Supported Row',
    group: GYM_EXERCISE_GROUPS.PULL,
  },

  // Lower
  squat: { name: 'Squat', group: GYM_EXERCISE_GROUPS.LOWER },
  legPress: { name: 'Leg Press', group: GYM_EXERCISE_GROUPS.LOWER },
  deadlift: { name: 'Deadlift', group: GYM_EXERCISE_GROUPS.LOWER },
  legExtension: { name: 'Leg Extension', group: GYM_EXERCISE_GROUPS.LOWER },
  legCurl: { name: 'Leg Curl', group: GYM_EXERCISE_GROUPS.LOWER },
  calfRaise: { name: 'Calf Raise', group: GYM_EXERCISE_GROUPS.LOWER },
  bulgarianSplitSquat: {
    name: 'Bulgarian Split Squat',
    group: GYM_EXERCISE_GROUPS.LOWER,
  },
  reverseNordicCurl: {
    name: 'Reverse Nordic Curl',
    group: GYM_EXERCISE_GROUPS.LOWER,
  },
  romanianDeadLift: {
    name: 'Romanian Deadlift',
    group: GYM_EXERCISE_GROUPS.LOWER,
  },

  // Cardio (with duration)
  treadmill: {
    name: 'Treadmill',
    group: GYM_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
  },
  elliptical: {
    name: 'Elliptical',
    group: GYM_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
  },
  stationaryBike: {
    name: 'Stationary Bike',
    group: GYM_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
  },

  // Core
  cableCrunch: { name: 'Cable Crunch', group: GYM_EXERCISE_GROUPS.CORE },
  machineRotation: {
    name: 'Machine Rotation',
    group: GYM_EXERCISE_GROUPS.CORE,
  },
  abMachine: { name: 'Ab Machine', group: GYM_EXERCISE_GROUPS.CORE },
  woodChopper: { name: 'Cable Wood Chopper', group: GYM_EXERCISE_GROUPS.CORE },
} as const;

export const POPULAR_GYM_EXERCISES: (keyof typeof GYM_EXERCISES)[] = [
  'benchPress',
  'squat',
  'deadlift',
  'shoulderPress',
  'latPulldown',
  'bicepCurl',
];
