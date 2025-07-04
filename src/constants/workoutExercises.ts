export const WORKOUT_EXERCISE_GROUPS = {
  PUSH: 'Upper Body - Push',
  PULL: 'Upper Body - Pull',
  LOWER: 'Lower Body',
  CORE: 'Core',
  CARDIO: 'Cardio',
} as const;

export type BaseExercise = {
  name: string;
  group: (typeof WORKOUT_EXERCISE_GROUPS)[keyof typeof WORKOUT_EXERCISE_GROUPS];
};

export type DurationExercise = BaseExercise & {
  hasDuration: true;
  durationUnit: 'minutes' | 'seconds';
};

export type RegularExercise = BaseExercise & {
  hasDuration?: false;
};

export type WorkoutExercise = DurationExercise | RegularExercise;

export const WORKOUT_EXERCISES: Record<string, WorkoutExercise> = {
  benchPress: { name: 'Bench Press', group: WORKOUT_EXERCISE_GROUPS.PUSH },
  pecFly: { name: 'Pec Fly', group: WORKOUT_EXERCISE_GROUPS.PUSH },
  inclineBenchPress: {
    name: 'Incline Bench Press',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  shoulderPress: {
    name: 'Shoulder Press',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  tricepExtension: {
    name: 'Tricep Extension',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  lateralRaise: { name: 'Lateral Raise', group: WORKOUT_EXERCISE_GROUPS.PUSH },
  dumbbellInclineBenchPress: {
    name: 'Dumbbell Incline Bench Press',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  overheadPress: {
    name: 'Overhead Press',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  latPulldown: { name: 'Lat Pulldown', group: WORKOUT_EXERCISE_GROUPS.PULL },
  seatedRow: { name: 'Seated Row', group: WORKOUT_EXERCISE_GROUPS.PULL },
  bicepCurl: { name: 'Bicep Curl', group: WORKOUT_EXERCISE_GROUPS.PULL },
  hammerCurl: { name: 'Hammer Curl', group: WORKOUT_EXERCISE_GROUPS.PULL },
  chestSupportedRow: {
    name: 'Chest Supported Row',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
  },
  squat: { name: 'Squat', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  legPress: { name: 'Leg Press', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  deadlift: { name: 'Deadlift', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  legExtension: { name: 'Leg Extension', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  legCurl: { name: 'Leg Curl', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  calfRaise: { name: 'Calf Raise', group: WORKOUT_EXERCISE_GROUPS.LOWER },
  bulgarianSplitSquat: {
    name: 'Bulgarian Split Squat',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  reverseNordicCurl: {
    name: 'Reverse Nordic Curl',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  romanianDeadLift: {
    name: 'Romanian Deadlift',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  treadmill: {
    name: 'Treadmill',
    group: WORKOUT_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
    durationUnit: 'minutes',
  },
  elliptical: {
    name: 'Elliptical',
    group: WORKOUT_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
    durationUnit: 'minutes',
  },
  stationaryBike: {
    name: 'Stationary Bike',
    group: WORKOUT_EXERCISE_GROUPS.CARDIO,
    hasDuration: true,
    durationUnit: 'minutes',
  },
  cableCrunch: { name: 'Cable Crunch', group: WORKOUT_EXERCISE_GROUPS.CORE },
  machineRotation: {
    name: 'Machine Rotation',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  abMachine: { name: 'Ab Machine', group: WORKOUT_EXERCISE_GROUPS.CORE },
  woodChopper: {
    name: 'Cable Wood Chopper',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  backExtenstion: {
    name: 'Back Extension',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  deadhang: {
    name: 'Deadhang',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
    hasDuration: true,
    durationUnit: 'seconds',
  },
  handstand: {
    name: 'Handstand',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
    hasDuration: true,
    durationUnit: 'seconds',
  },
  pullUp: {
    name: 'Pull Up',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
  },
  rearDeltoidFly: {
    name: 'Rear Deltoid Fly',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
  },
  bentOverBarbellRow: {
    name: 'Bent over Barbell Row',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
  },
  cableFacePulls: {
    name: 'Cable Face Pulls',
    group: WORKOUT_EXERCISE_GROUPS.PULL,
  },
  pushUp: {
    name: 'Push Up',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  pikePushUp: {
    name: 'Pike Push Up',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  inclinePushUp: {
    name: 'Incline Push Up',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  tuckPlancheHold: {
    name: 'Tuck Planche Hold',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
    hasDuration: true,
    durationUnit: 'seconds',
  },
  declinePushUp: {
    name: 'Decline Push Up',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  kneePushUp: {
    name: 'Knee Push Up',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  assistedDip: {
    name: 'Assisted Dip',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  dip: {
    name: 'Dip',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  jumpSquat: {
    name: 'Jump Squat',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  splitSquat: {
    name: 'Split Squat',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  pistolSquat: {
    name: 'Pistol Squat',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  lunges: {
    name: 'Lunges',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  plank: {
    name: 'Plank',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
    hasDuration: true,
    durationUnit: 'seconds',
  },
  abWheel: {
    name: 'Ab Wheel',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  lSit: {
    name: 'L Sit',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
    hasDuration: true,
    durationUnit: 'seconds',
  },
  sitUp: {
    name: 'Sit Up',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  legRaises: {
    name: 'Leg Raises',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  birdDog: {
    name: 'Bird Dog',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  machineTricepExtension: {
    name: 'Tricep Extension Machine',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  bridge: {
    name: 'Bridge',
    group: WORKOUT_EXERCISE_GROUPS.CORE,
  },
  clamshell: {
    name: 'Clamshell',
    group: WORKOUT_EXERCISE_GROUPS.LOWER,
  },
  punch: {
    name: 'Punch',
    group: WORKOUT_EXERCISE_GROUPS.PUSH,
  },
  jumpingJacks: {
    name: 'Jumping Jacks',
    group: WORKOUT_EXERCISE_GROUPS.CARDIO,
  },
} as const;

export const POPULAR_WORKOUT_EXERCISES = [
  'benchPress',
  'squat',
  'deadlift',
  'shoulderPress',
  'overheadPress',
  'latPulldown',
  'bicepCurl',
  'pullUp',
  'deadhang',
  'backExtenstion',
  'pushUp',
  'sitUp',
] as const;
