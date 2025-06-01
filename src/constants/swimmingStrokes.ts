export const STROKE_CATEGORIES = [
  'Competitive',
  'Recreational',
  'Survival',
  'Drill',
] as const;
export type StrokeCategory = (typeof STROKE_CATEGORIES)[number];

// Drill-specific metadata
export const DRILL_DIFFICULTY = [
  'Beginner',
  'Intermediate',
  'Advanced',
] as const;
export type DrillDifficulty = (typeof DRILL_DIFFICULTY)[number];

export const DRILL_FOCUS = [
  'Balance',
  'Breathing',
  'Kicking',
  'Pulling',
  'Rotation',
  'Coordination',
  'Feel',
  'Endurance',
  'Streamline',
  'Recovery',
  'Strength',
] as const;
export type DrillFocus = (typeof DRILL_FOCUS)[number];

// Stroke type
export type SwimmingStroke = {
  name: string;
  category: StrokeCategory;
  // difficulty and focus are only present for drills,
  // so we mark them optional here
  difficulty?: DrillDifficulty;
  focus?: DrillFocus[];
};

// Main stroke object
export const SWIMMING_STROKES = {
  // Competitive strokes
  freestyle: {
    name: 'Freestyle',
    category: 'Competitive',
  },
  breaststroke: {
    name: 'Breaststroke',
    category: 'Competitive',
  },
  backstroke: {
    name: 'Backstroke',
    category: 'Competitive',
  },
  butterfly: {
    name: 'Butterfly',
    category: 'Competitive',
  },

  // Recreational strokes
  elementaryBackstroke: {
    name: 'Elementary Backstroke',
    category: 'Recreational',
  },
  sidestroke: {
    name: 'Sidestroke',
    category: 'Recreational',
  },

  // Survival strokes
  survivalBackstroke: {
    name: 'Survival Backstroke',
    category: 'Survival',
  },
  dogPaddle: {
    name: 'Dog Paddle',
    category: 'Survival',
  },

  // Drill strokes (with difficulty and focus)
  supermanGlide: {
    name: 'Superman Glide',
    category: 'Drill',
    difficulty: 'Beginner',
    focus: ['Balance'],
  },
  kickWithBoard: {
    name: 'Kick with Kickboard (Front)',
    category: 'Drill',
    difficulty: 'Beginner',
    focus: ['Kicking', 'Balance'],
  },
  kickOnBack: {
    name: 'Kick on Back',
    category: 'Drill',
    difficulty: 'Beginner',
    focus: ['Kicking', 'Balance'],
  },
  sideKick: {
    name: 'Side Kick Drill',
    category: 'Drill',
    difficulty: 'Beginner',
    focus: ['Balance', 'Rotation'],
  },
  drill3x3x3: {
    name: '3-3-3 Drill',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Rotation', 'Coordination'],
  },
  singleArmFreestyle: {
    name: 'Single-arm Freestyle',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Pulling', 'Balance'],
  },
  catchUp: {
    name: 'Catch-up Drill',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Coordination', 'Rotation'],
  },
  zipperDrill: {
    name: 'Zipper Drill',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Recovery', 'Coordination'],
  },
  breathingDrill: {
    name: 'Breathing Pattern Drill',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Breathing', 'Coordination'],
  },
  fingertipDrag: {
    name: 'Fingertip Drag',
    category: 'Drill',
    difficulty: 'Intermediate',
    focus: ['Feel', 'Recovery'],
  },
  sculling: {
    name: 'Sculling',
    category: 'Drill',
    difficulty: 'Advanced',
    focus: ['Feel', 'Pulling'],
  },
  torpedoPushOff: {
    name: 'Torpedo Push-off',
    category: 'Drill',
    difficulty: 'Beginner',
    focus: ['Streamline'],
  },
  fistDrill: {
    name: 'Closed-fist Freestyle',
    category: 'Drill',
    difficulty: 'Advanced',
    focus: ['Feel', 'Pulling'],
  },
  tarzanDrill: {
    name: 'Tarzan Drill (Head-up Freestyle)',
    category: 'Drill',
    difficulty: 'Advanced',
    focus: ['Strength', 'Endurance'],
  },
} as const;

export type SwimmingStrokeKey = keyof typeof SWIMMING_STROKES;

// Grouped by category for filtering or menus
export const STROKES_BY_CATEGORY: Record<StrokeCategory, SwimmingStrokeKey[]> =
  {
    Competitive: ['freestyle', 'breaststroke', 'backstroke', 'butterfly'],
    Recreational: ['elementaryBackstroke', 'sidestroke'],
    Survival: ['survivalBackstroke', 'dogPaddle'],
    Drill: [
      'supermanGlide',
      'kickWithBoard',
      'kickOnBack',
      'sideKick',
      'drill3x3x3',
      'singleArmFreestyle',
      'catchUp',
      'zipperDrill',
      'breathingDrill',
      'fingertipDrag',
      'sculling',
      'torpedoPushOff',
      'fistDrill',
      'tarzanDrill',
    ],
  };
