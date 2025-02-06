import { GoalType } from '@/types/Goal';
import { endOfYear, startOfYear } from 'date-fns';

export enum TimePeriod {
  Year = 'Year',
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

// Function to convert time period to start and end dates
export const timePeriodToDates = (
  timePeriod: TimePeriod,
  year: number
): { startDate: Date; endDate: Date } => {
  let startDate: Date;
  let endDate: Date;

  switch (timePeriod) {
    case TimePeriod.Q1:
      startDate = new Date(year, 0, 1); // January 1st
      endDate = new Date(year, 2, 31); // March 31st
      break;
    case TimePeriod.Q2:
      startDate = new Date(year, 3, 1); // April 1st
      endDate = new Date(year, 5, 30); // June 30th
      break;
    case TimePeriod.Q3:
      startDate = new Date(year, 6, 1); // July 1st
      endDate = new Date(year, 8, 30); // September 30th
      break;
    case TimePeriod.Q4:
      startDate = new Date(year, 9, 1); // October 1st
      endDate = new Date(year, 11, 31); // December 31st
      break;
    case TimePeriod.Year:
      startDate = startOfYear(new Date(year, 0, 1)); // Start of the year
      endDate = endOfYear(new Date(year, 0, 1)); // End of the year
      break;
    default:
      throw new Error(`Invalid time period: ${timePeriod}`);
  }

  return { startDate, endDate };
};

// Helper function to determine the time period (now returns TimePeriod enum)
export const datesToTimePeriod = (
  startDate: Date,
  endDate: Date
): TimePeriod => {
  const startMonth = startDate.getMonth() + 1; // Months are 0-indexed, so we add 1
  const endMonth = endDate.getMonth() + 1;

  // If the start and end are in the same year, determine the quarter or year
  if (startDate.getFullYear() === endDate.getFullYear()) {
    if (startMonth >= 1 && endMonth <= 3) return TimePeriod.Q1; // Jan-Mar
    if (startMonth >= 4 && endMonth <= 6) return TimePeriod.Q2; // Apr-Jun
    if (startMonth >= 7 && endMonth <= 9) return TimePeriod.Q3; // Jul-Sep
    if (startMonth >= 10 && endMonth <= 12) return TimePeriod.Q4; // Oct-Dec
  }

  // If the start and end dates span multiple quarters, return 'Year'
  return TimePeriod.Year;
};

// Function to split goals by time period (using TimePeriod enum)
export const splitGoalsByTimePeriod = (goals: GoalType[]) => {
  const groupedGoals: {
    [TimePeriod.Q1]: GoalType[];
    [TimePeriod.Q2]: GoalType[];
    [TimePeriod.Q3]: GoalType[];
    [TimePeriod.Q4]: GoalType[];
    [TimePeriod.Year]: GoalType[];
  } = {
    [TimePeriod.Q1]: [],
    [TimePeriod.Q2]: [],
    [TimePeriod.Q3]: [],
    [TimePeriod.Q4]: [],
    [TimePeriod.Year]: [],
  };

  if (!goals) return groupedGoals;

  goals.forEach((goal) => {
    const period = datesToTimePeriod(goal.startDate, goal.endDate);
    groupedGoals[period].push(goal);
  });

  // Sort goals by order within each period
  Object.keys(groupedGoals).forEach((period) => {
    groupedGoals[period as TimePeriod].sort((a, b) => a.order - b.order);
  });

  return groupedGoals;
};
