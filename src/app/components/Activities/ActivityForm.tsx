import { ActivityType, ActivityTypes } from '@/types/Activity';
import CalisthenicsForm from '../forms/CalisthenicsForm';
import ClimbingForm from '../forms/ClimbingForm';
import HangboardForm from '../forms/HangboardForm';
import StretchingForm from '../forms/StretchingForm';

const ActivityForm = ({
  selectedActivity,
  onClose,
}: {
  selectedActivity: ActivityType;
  onClose: () => void;
}) => {
  switch (selectedActivity.type) {
    case ActivityTypes.Climbing:
      return <ClimbingForm initialData={selectedActivity} onClose={onClose} />;
    case ActivityTypes.Calisthenics:
      return (
        <CalisthenicsForm initialData={selectedActivity} onClose={onClose} />
      );
    case ActivityTypes.Stretching:
      return (
        <StretchingForm initialData={selectedActivity} onClose={onClose} />
      );

    case ActivityTypes.Hangboard:
      return <HangboardForm initialData={selectedActivity} onClose={onClose} />;
    default:
      return null;
  }
};

export default ActivityForm;
