import BoulderingForm from '@/app/components/BoulderingForm';
import CalisthenicsForm from '@/app/components/CalisthenicsForm';
import GymForm from '@/app/components/GymForm';
import ClimbingIcon from '@/app/components/icons/ClimbingIcon';
import StretchingForm from '@/app/components/StretchingForm';
import WinterSportForm from '@/app/components/WinterSportForm';
import { BicepsFlexed, Dumbbell } from 'lucide-react';
import { FaSnowboarding } from 'react-icons/fa';
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
  {
    id: 'winter_sports',
    label: 'Winter Sports',
    Component: WinterSportForm,
    icon: FaSnowboarding,
  },
] as const;

export default activityOptions;
