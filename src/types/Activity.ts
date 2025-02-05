export const ActivityType = {
  Bouldering: 'bouldering',
  Gym: 'gym',
  Calisthenics: 'calisthenics',
  Stretching: 'stretching',
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export type BoulderingGrade = {
  grade: string;
  count: number;
};

export type BaseActivity = {
  id: string;
  userId: string;
  createdAt: Date;
  activityDate: Date;
};

export type BoulderingData = {
  type: typeof ActivityType.Bouldering;
  gym: string;
  grades: BoulderingGrade[];
};

export type GymData = {
  type: typeof ActivityType.Gym;
  // Add gym-specific fields here
};

export type CalisthenicsData = {
  type: typeof ActivityType.Calisthenics;
  // Add calisthenics-specific fields here
};

export type StretchingData = {
  type: typeof ActivityType.Stretching;
  // Add stretching-specific fields here
};

export type ActivityData =
  | BoulderingData
  | GymData
  | CalisthenicsData
  | StretchingData;

export type Activity = BaseActivity & ActivityData;
