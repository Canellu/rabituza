export const ActivityTypes = {
  Bouldering: 'bouldering',
  Gym: 'gym',
  Calisthenics: 'calisthenics',
  Stretching: 'stretching',
} as const;

export type Activity = (typeof ActivityTypes)[keyof typeof ActivityTypes];

export type BoulderingGradeType = {
  grade: string;
  count: number;
};

export type ActivityRatingsType = {
  intensity: number; // How hard was the workout (0: very easy - 10: extremely hard)
  energy: number; // Physical/mental state (0: exhausted/sore - 10: fresh/energetic)
  enjoyment: number; // How fun/satisfying was it (0: terrible - 10: amazing)
};

export type BaseActivityType = {
  id: string;
  userId: string;
  createdAt: Date;
  activityDate: Date;
  ratings: ActivityRatingsType;
};

export type BoulderingDataType = {
  type: typeof ActivityTypes.Bouldering;
  gym: string;
  grades: BoulderingGradeType[];
};

export type GymDataType = {
  type: typeof ActivityTypes.Gym;
  // Add gym-specific fields here
};

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

export type CalisthenicsExerciseType = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type CalisthenicsDataType = {
  type: typeof ActivityTypes.Calisthenics;
  exercises: CalisthenicsExerciseType[];
  activityDate: Date;
};

export type StretchingDataType = {
  type: typeof ActivityTypes.Stretching;
  // Add stretching-specific fields here
};

export type ActivityDataType =
  | BoulderingDataType
  | GymDataType
  | CalisthenicsDataType
  | StretchingDataType;

export type ActivityType = BaseActivityType & ActivityDataType;
