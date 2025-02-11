export const ActivityTypes = {
  Rest: 'rest',
  Climbing: 'climbing',
  Hangboard: 'hangboard',
  Gym: 'gym',
  Calisthenics: 'calisthenics',
  Stretching: 'stretching',
  WinterSports: 'winter_sports',
  Swimming: 'swimming',
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

export type ActivityMetaDataType = {
  bodyWeight: number;
};

export type ClimbingDataType = {
  type: typeof ActivityTypes.Climbing;
  gym: string;
  grades: ClimbingGradeType[];
};

export type CalisthenicsSetType = {
  sets: number;
  weight?: number;
} & (
  | {
      reps: number;
      duration?: never;
    }
  | {
      duration: number;
      reps?: never;
    }
);

export type CalisthenicsExerciseType = {
  name: string;
  setGroups: CalisthenicsSetType[];
};

export type CalisthenicsDataType = {
  type: typeof ActivityTypes.Calisthenics;
  exercises: CalisthenicsExerciseType[];
};

export type StretchingDataType = {
  type: typeof ActivityTypes.Stretching;
  duration: number;
  stretches: string[];
};

export type HangboardEdgeType = {
  size: number;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
};

export type HangboardDataType = {
  type: typeof ActivityTypes.Hangboard;
  edges: HangboardEdgeType[];
};

export type GymSetType = {
  sets: number;
} & (
  | {
      reps: number;
      weight: number;
      duration?: never;
    }
  | {
      duration: number;
      weight?: never;
      reps?: never;
    }
);

export type GymExerciseType = {
  name: string;
  setGroups: GymSetType[];
};

export type GymDataType = {
  type: typeof ActivityTypes.Gym;
  exercises: GymExerciseType[];
};

export type RestDataType = {
  type: typeof ActivityTypes.Rest;
  // Add rest-specific fields here
};

export type WinterSportsDataType = {
  type: typeof ActivityTypes.WinterSports;
  // Add winter sports-specific fields here
};

export type SwimmingDataType = {
  type: typeof ActivityTypes.Swimming;
  // Add swimming specific fields here
};

export type ActivityDataType =
  | ClimbingDataType
  | GymDataType
  | CalisthenicsDataType
  | StretchingDataType
  | HangboardDataType;

export type ActivityType = BaseActivityType & ActivityDataType;
