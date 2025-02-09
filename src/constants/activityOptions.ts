import ActiveRestForm from '@/app/components/ActiveRestForm';
import CalisthenicsForm from '@/app/components/CalisthenicsForm';
import ClimbingForm from '@/app/components/ClimbingForm';
import FingerboardForm from '@/app/components/FingerboardForm';

import GymForm from '@/app/components/GymForm';
import ClimbingIcon from '@/app/components/icons/ClimbingIcon';
import StretchingForm from '@/app/components/StretchingForm';
import WinterSportForm from '@/app/components/WinterSportForm';
import { BicepsFlexed, Dumbbell, Grab } from 'lucide-react';
import { FaSnowboarding } from 'react-icons/fa';
import { GiNightSleep } from 'react-icons/gi';
import { GrYoga } from 'react-icons/gr';

const activityOptions = [
  {
    id: 'active_rest',
    label: 'Active Rest',
    Component: ActiveRestForm,
    icon: GiNightSleep,
  },
  {
    id: 'climbing',
    label: 'Climbing',
    Component: ClimbingForm,
    icon: ClimbingIcon,
  },
  {
    id: 'fingerboard',
    label: 'Fingerboard',
    Component: FingerboardForm,
    icon: Grab,
  },
  {
    id: 'calisthenics',
    label: 'Calisthenics',
    Component: CalisthenicsForm,
    icon: BicepsFlexed,
  },
  {
    id: 'gym',
    label: 'Gym',
    Component: GymForm,
    icon: Dumbbell,
  },
  {
    id: 'stretching',
    label: 'Stretching',
    Component: StretchingForm,
    icon: GrYoga,
  },
  {
    id: 'winter_sports',
    label: 'Winter Sports',
    Component: WinterSportForm,
    icon: FaSnowboarding,
  },
] as const;

export default activityOptions;
