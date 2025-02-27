import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { useState } from 'react';
import ActivitiesList from '../Activities/ActivitiesList';
import ActivitiesMonth from '../Activities/ActivitiesMonth';

interface UserMonthProps {
  user: User & {
    activities: ActivityType[];
  };
}

const UserMonth = ({ user }: UserMonthProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredActivities = user.activities?.filter(
    (activity) =>
      new Date(activity.activityDate).toLocaleDateString() ===
      selectedDate.toLocaleDateString()
  );

  return (
    <div className="flex flex-col items-start gap-6 justify-between">
      <div className="space-y-2 w-full">
        <span className="text-lg font-medium">Monthly activities</span>

        <ActivitiesMonth
          onDateSelect={setSelectedDate}
          activities={user.activities}
          selectedDate={selectedDate}
        />
      </div>
      <ActivitiesList
        activities={filteredActivities}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default UserMonth;
