import { SwimmingStrokeKey } from '@/constants/swimmingStrokes';
import { WORKOUT_EXERCISES } from '@/constants/workoutExercises';

export const ActivityTypes = {
  Rest: 'rest',
  Climbing: 'climbing',
  Hangboard: 'hangboard',
  Workout: 'workout',
  Stretching: 'stretching',
  WinterSports: 'winter_sports',
  Swimming: 'swimming',
  Running: 'running',
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

export type ClimbingDataType = {
  type: typeof ActivityTypes.Climbing;
  gym: string;
  grades: ClimbingGradeType[];
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

export type WorkoutSetType = {
  sets: number;
  weight: number;
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

export type WorkoutExerciseType = {
  name: keyof typeof WORKOUT_EXERCISES;
  setGroups: WorkoutSetType[];
};

export type WorkoutDataType = {
  type: typeof ActivityTypes.Workout;
  exercises: WorkoutExerciseType[];
};

export type RestDataType = {
  type: typeof ActivityTypes.Rest;
  // Add rest-specific fields here
};

export type WinterSportsDataType = {
  type: typeof ActivityTypes.WinterSports;
  // Add winter sports-specific fields here
};

export const SwimmingLocations = {
  pool: 'pool',
  lake: 'lake',
  sea: 'sea',
  beach: 'beach',
} as const;

export type SwimmingLocationType =
  (typeof SwimmingLocations)[keyof typeof SwimmingLocations];

export type SwimmingStrokeItem = {
  name: SwimmingStrokeKey;
  sets: string;
  duration?: string; // for drills
  laps?: string;
};

export type SwimmingPoolDataType = {
  type: typeof ActivityTypes.Swimming;
  duration: number; // Total seconds
  distance?: number; // Optional: Total meters if user wants to override
  location: typeof SwimmingLocations.pool;
  poolLength: number; // e.g., 25 or 50
  strokes: SwimmingStrokeItem[];
};

export type SwimmingRecordingDataType = {
  type: typeof ActivityTypes.Swimming;
  duration: number; // Total seconds
  distance?: number; // Total meters
  location: Exclude<SwimmingLocationType, typeof SwimmingLocations.pool>;
  routes?: Route[];
  status: DistanceActivitySessionStatus;
};

export type RunningDataType = {
  type: typeof ActivityTypes.Running;
  duration: number; // Seconds
  distance?: number; // Meters
  routes?: Route[];
  status: DistanceActivitySessionStatus;
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
  accuracy: number;
  speed: number | null;
};

export type Route = {
  id: string;
  createdAt: Date;
  geolocations: GeoLocation[];
};

export const DistanceActivitySessionStatuses = {
  completed: 'completed',
  inProgress: 'in_progress',
} as const;
export type DistanceActivitySessionStatus =
  (typeof DistanceActivitySessionStatuses)[keyof typeof DistanceActivitySessionStatuses];

export type DrivingDataType = {
  type: typeof ActivityTypes.Driving;
  purpose: DrivingPurpose;
  duration: number;
  weatherConditions: WeatherCondition;
  trafficConditions: TrafficCondition;
  distance?: number;
  routes?: Route[];
  status: DistanceActivitySessionStatus;
};

export type RecordableActivityDataType =
  | DrivingDataType
  | RunningDataType
  | SwimmingRecordingDataType;

export type ActivityDataType =
  | ClimbingDataType
  | WorkoutDataType
  | StretchingDataType
  | HangboardDataType
  | RestDataType
  | WinterSportsDataType
  | SwimmingRecordingDataType
  | SwimmingPoolDataType
  | RunningDataType
  | DrivingDataType;

export type ActivityType = BaseActivityType & ActivityDataType;
