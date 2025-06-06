import { ActivityType, ActivityTypes } from '@/types/Activity';
import ClimbingForm from '../forms/ClimbingForm';
import DrivingForm from '../forms/DrivingForm';
import HangboardForm from '../forms/HangboardForm';
import RunningForm from '../forms/RunningForm';
import StretchingForm from '../forms/StretchingForm';
import SwimmingForm from '../forms/SwimmingForm';
import WorkoutForm from '../forms/WorkoutForm';

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
    case ActivityTypes.Stretching:
      return (
        <StretchingForm initialData={selectedActivity} onClose={onClose} />
      );
    case ActivityTypes.Hangboard:
      return <HangboardForm initialData={selectedActivity} onClose={onClose} />;
    case ActivityTypes.Workout:
      return <WorkoutForm initialData={selectedActivity} onClose={onClose} />;
    case ActivityTypes.Driving:
      return <DrivingForm initialData={selectedActivity} onClose={onClose} />;
    case ActivityTypes.Running:
      return <RunningForm initialData={selectedActivity} onClose={onClose} />;
    case ActivityTypes.Swimming:
      return <SwimmingForm initialData={selectedActivity} onClose={onClose} />;
    default:
      return null;
  }
};

export default ActivityForm;
