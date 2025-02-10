import CalisthenicsForm from '@/app/components/CalisthenicsForm';
import ClimbingForm from '@/app/components/ClimbingForm';
import FingerboardForm from '@/app/components/FingerboardForm';
import RestForm from '@/app/components/RestForm';
import GymForm from '@/app/components/GymForm';
import ClimbingIcon from '@/app/components/icons/ClimbingIcon';
import StretchingForm from '@/app/components/StretchingForm';
import WinterSportForm from '@/app/components/WinterSportForm';
import { ActivityTypes } from '@/types/Activity';
import { BicepsFlexed, Dumbbell, Grab } from 'lucide-react';
import { FaSnowboarding } from 'react-icons/fa';
import { GiNightSleep } from 'react-icons/gi';
import { GrYoga } from 'react-icons/gr';

export const ActivityGroups = {
  PHYSICAL: 'Physical Activities',
  RECOVERY: 'Recovery Activities',
  SEASONAL: 'Seasonal Activities',
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
    id: ActivityTypes.Fingerboard,
    label: 'Fingerboard',
    Component: FingerboardForm,
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
] as const;

export default activityOptions;
