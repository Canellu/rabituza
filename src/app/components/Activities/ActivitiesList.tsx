import { ActivityType, ActivityTypes } from '@/types/Activity';
import { format } from 'date-fns';
import ActivityCardClimbing from './ActivityCardClimbing';
import ActivityCardDriving from './ActivityCardDriving';
import ActivityCardHangboard from './ActivityCardHangboard';
import ActivityCardStretching from './ActivityCardStretching';
import ActivityCardWorkout from './ActivityCardWorkout';

type ActivitiesListProps = {
  activities?: ActivityType[];
  selectedDate: Date;
  onEditActivity?: (activity: ActivityType) => void;
  readOnly?: boolean;
};

const ActivitiesList = ({
  activities,
  selectedDate,
  onEditActivity,
  readOnly,
}: ActivitiesListProps) => {
  return (
    <section className="space-y-3 w-full">
      <h2 className="flex flex-col -space-y-1">
        <span className="text-stone-700 font-medium text-sm">
          Activities for
        </span>
        <span className="text-emerald-800 text-lg font-semibold">
          {format(selectedDate, 'EEEE, do MMMM')}
        </span>
      </h2>
      <div className="space-y-4 pb-10">
        {activities?.map((activity) => {
          return (
            <div key={activity.id}>
              {(() => {
                switch (activity.type) {
                  case ActivityTypes.Climbing:
                    return (
                      <ActivityCardClimbing
                        readOnly
                        activity={activity}
                        onEdit={() =>
                          onEditActivity && onEditActivity(activity)
                        }
                      />
                    );
                  case ActivityTypes.Stretching:
                    return (
                      <ActivityCardStretching
                        readOnly
                        activity={activity}
                        onEdit={() =>
                          onEditActivity && onEditActivity(activity)
                        }
                      />
                    );
                  case ActivityTypes.Hangboard:
                    return (
                      <ActivityCardHangboard
                        readOnly
                        activity={activity}
                        onEdit={() =>
                          onEditActivity && onEditActivity(activity)
                        }
                      />
                    );
                  case ActivityTypes.Workout:
                    return (
                      <ActivityCardWorkout
                        readOnly
                        activity={activity}
                        onEdit={() =>
                          onEditActivity && onEditActivity(activity)
                        }
                      />
                    );
                  case ActivityTypes.Driving:
                    return (
                      <ActivityCardDriving
                        readOnly
                        activity={activity}
                        onEdit={() =>
                          onEditActivity && onEditActivity(activity)
                        }
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          );
        })}

        {activities?.length === 0 && (
          <div className="border p-4 bg-white rounded-xl">
            <span className="text-sm font-medium text-stone-600">
              No activities logged for this date
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivitiesList;
