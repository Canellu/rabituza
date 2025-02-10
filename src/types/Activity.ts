export const ActivityTypes = {
  Rest: 'rest',
  Climbing: 'climbing',
  Fingerboard: 'fingerboard',
  Gym: 'gym',
  Calisthenics: 'calisthenics',
  Stretching: 'stretching',
  WinterSports: 'winter_sports',
} as const;

export type Activity = (typeof ActivityTypes)[keyof typeof ActivityTypes];

export type ClimbingGradeType = {
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
  note?: string;
};

export type ClimbingDataType = {
  type: typeof ActivityTypes.Climbing;
  gym: string;
  grades: ClimbingGradeType[];
};

export type CalisthenicsExerciseType = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type CalisthenicsDataType = {
  type: typeof ActivityTypes.Calisthenics;
  activityDate: Date;
  exercises: CalisthenicsExerciseType[];
};

export type StretchingDataType = {
  type: typeof ActivityTypes.Stretching;
  activityDate: Date;
  duration: number;
  stretches: string[];
  note?: string;
};

export type GymDataType = {
  type: typeof ActivityTypes.Gym;
  // Add gym-specific fields here
};

export type RestDataType = {
  type: typeof ActivityTypes.Rest;
  // Add rest-specific fields here
};

export type WinterSportsDataType = {
  type: typeof ActivityTypes.WinterSports;
  // Add winter sports-specific fields here
};

export type FingerboardDataType = {
  type: typeof ActivityTypes.Fingerboard;
  // Add fingerboard-specific fields here
};

export type ActivityDataType =
  | ClimbingDataType
  | GymDataType
  | CalisthenicsDataType
  | StretchingDataType;

export type ActivityType = BaseActivityType & ActivityDataType;
