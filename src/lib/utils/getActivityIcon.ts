import activityOptions from '@/constants/activityOptions';

export const getActivityIcon = (activityType: string) => {
  return activityOptions.find(
    (option) => option.id === activityType.toLowerCase()
  )?.icon;
};
