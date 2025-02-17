export const ActivityTypes = {
  Rest: 'rest',
  Climbing: 'climbing',
  Hangboard: 'hangboard',
  Gym: 'gym',
  Calisthenics: 'calisthenics',
  Stretching: 'stretching',
  WinterSports: 'winter_sports',
  Swimming: 'swimming',
  Driving: 'driving',
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

export const TrafficConditions = {
  empty: 'empty',
  lightTraffic: 'light_traffic',
  moderateTraffic: 'moderate_traffic',
  busy: 'busy',
  heavyTraffic: 'heavy_traffic',
} as const;

export type TrafficCondition =
  (typeof TrafficConditions)[keyof typeof TrafficConditions];

export const WeatherConditions = {
  sunny: 'sunny',
  cloudy: 'cloudy',
  rainy: 'rainy',
  snowy: 'snowy',
  windy: 'windy',
  foggy: 'foggy',
} as const;

export type WeatherCondition =
  (typeof WeatherConditions)[keyof typeof WeatherConditions];

export const DrivingPurposes = {
  leisure: 'leisure',
  lesson: 'lesson',
} as const;
export type DrivingPurpose =
  (typeof DrivingPurposes)[keyof typeof DrivingPurposes];

export type GeoLocation = {
  latitude: number;
  longitude: number;
  timestamp: number;
};

export type Route = {
  id: string;
  createdAt: Date;
  geolocations: GeoLocation[];
};

export const DrivingSessionStatuses = {
  completed: 'completed',
  inProgress: 'in_progress',
} as const;
export type DrivingSessionStatus =
  (typeof DrivingSessionStatuses)[keyof typeof DrivingSessionStatuses];

export type DrivingDataType = {
  type: typeof ActivityTypes.Driving;
  purpose: DrivingPurpose;
  duration: number;
  weatherConditions: WeatherCondition;
  trafficConditions: TrafficCondition;
  distance?: number;
  routes?: Route[]; // Subcollection in Firestore
  status: DrivingSessionStatus;
};

export type ActivityDataType =
  | ClimbingDataType
  | GymDataType
  | CalisthenicsDataType
  | StretchingDataType
  | HangboardDataType
  | RestDataType
  | WinterSportsDataType
  | SwimmingDataType
  | DrivingDataType;

export type ActivityType = BaseActivityType & ActivityDataType;
