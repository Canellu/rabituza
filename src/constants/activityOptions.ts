import BoulderingForm from '@/app/components/BoulderingForm';
import CalisthenicsForm from '@/app/components/CalisthenicsForm';
import GymForm from '@/app/components/GymForm';
import StretchingForm from '@/app/components/StretchingForm';
import { Activity, Dumbbell, Mountain } from 'lucide-react';
import { GrYoga } from 'react-icons/gr';

const activityOptions = [
  {
    id: 'bouldering',
    label: 'Bouldering',
    Component: BoulderingForm,
    icon: Mountain,
  },
  {
    id: 'gym',
    label: 'Gym',
    Component: GymForm,
    icon: Dumbbell,
  },
  {
    id: 'calisthenics',
    label: 'Calisthenics',
    Component: CalisthenicsForm,
    icon: Activity,
  },
  {
    id: 'stretching',
    label: 'Stretching',
    Component: StretchingForm,
    icon: GrYoga,
  },
] as const;

export default activityOptions;
