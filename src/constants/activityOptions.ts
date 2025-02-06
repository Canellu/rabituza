import BoulderingForm from '@/app/components/BoulderingForm';
import CalisthenicsForm from '@/app/components/CalisthenicsForm';
import GymForm from '@/app/components/GymForm';
import ClimbingIcon from '@/app/components/icons/ClimbingIcon';
import StretchingForm from '@/app/components/StretchingForm';
import { BicepsFlexed, Dumbbell } from 'lucide-react';
import { GrYoga } from 'react-icons/gr';

const activityOptions = [
  {
    id: 'climbing',
    label: 'Climbing',
    Component: BoulderingForm,
    icon: ClimbingIcon,
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
] as const;

export default activityOptions;
