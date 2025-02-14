import CalisthenicsForm from '@/app/components/forms/CalisthenicsForm';
import ClimbingForm from '@/app/components/forms/ClimbingForm';
import DrivingForm from '@/app/components/forms/DrivingForm';
import GymForm from '@/app/components/forms/GymForm';
import HangboardForm from '@/app/components/forms/HangboardForm';
import RestForm from '@/app/components/forms/RestForm';
import StretchingForm from '@/app/components/forms/StretchingForm';
import SwimmingForm from '@/app/components/forms/SwimmingForm';
import WinterSportForm from '@/app/components/forms/WinterSportForm';
import ClimbingIcon from '@/app/components/icons/ClimbingIcon';
import { ActivityTypes } from '@/types/Activity';
import { BicepsFlexed, Car, Dumbbell, Grab } from 'lucide-react';
import { FaSnowboarding, FaSwimmer } from 'react-icons/fa';
import { GiNightSleep } from 'react-icons/gi';
import { GrYoga } from 'react-icons/gr';

export const ActivityGroups = {
  PHYSICAL: 'Physical Activities',
  RECOVERY: 'Recovery Activities',
  SEASONAL: 'Seasonal Activities',
  OTHER: 'Other Activities',
} as const;

const activityOptions = [
  {
    id: ActivityTypes.Climbing,
    label: 'Climbing',
    Component: ClimbingForm,
    icon: ClimbingIcon,
    group: ActivityGroups.PHYSICAL,
  },
  {
    id: ActivityTypes.Hangboard,
    label: 'Hangboard',
    Component: HangboardForm,
    icon: Grab,
    group: ActivityGroups.PHYSICAL,
  },
  {
    id: ActivityTypes.Calisthenics,
    label: 'Calisthenics',
    Component: CalisthenicsForm,
    icon: BicepsFlexed,
    group: ActivityGroups.PHYSICAL,
  },
  {
    id: ActivityTypes.Gym,
    label: 'Gym',
    Component: GymForm,
    icon: Dumbbell,
    group: ActivityGroups.PHYSICAL,
  },
  {
    id: ActivityTypes.Swimming,
    label: 'Swimming',
    Component: SwimmingForm,
    icon: FaSwimmer,
    group: ActivityGroups.PHYSICAL,
  },
  {
    id: ActivityTypes.Rest,
    label: 'Rest',
    Component: RestForm,
    icon: GiNightSleep,
    group: ActivityGroups.RECOVERY,
  },
  {
    id: ActivityTypes.Stretching,
    label: 'Stretching',
    Component: StretchingForm,
    icon: GrYoga,
    group: ActivityGroups.RECOVERY,
  },
  {
    id: ActivityTypes.WinterSports,
    label: 'Winter Sports',
    Component: WinterSportForm,
    icon: FaSnowboarding,
    group: ActivityGroups.SEASONAL,
  },
  {
    id: ActivityTypes.Driving,
    label: 'Driving',
    Component: DrivingForm,
    icon: Car,
    group: ActivityGroups.OTHER,
  },
] as const;

export default activityOptions;
