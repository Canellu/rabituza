import { ActivityType, ActivityTypes } from '@/types/Activity';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { STAGGER_CHILD_VARIANTS, STAGGER_CONTAINER_CONFIG } from '@/constants/animationConfig';
import ActivityCardCalisthenics from './ActivityCardCalisthenics';
import ActivityCardClimbing from './ActivityCardClimbing';
import ActivityCardDriving from './ActivityCardDriving';
import ActivityCardGym from './ActivityCardGym';
import ActivityCardHangboard from './ActivityCardHangboard';
import ActivityCardStretching from './ActivityCardStretching';

type ActivitiesListProps = {
  activities?: ActivityType[];
  selectedDate: Date;
  onEditActivity: (activity: ActivityType) => void;
};

const ActivitiesList = ({ activities, selectedDate, onEditActivity }: ActivitiesListProps) => {
  return (
    <section className="space-y-3">
      <h2 className="flex flex-col -space-y-1">
        <span className="text-stone-700 font-medium text-sm">
          Activities for
        </span>
        <span className="text-emerald-800 text-lg font-semibold">
          {format(selectedDate, 'EEEE, do MMMM')}
        </span>
      </h2>
      <motion.div className="space-y-4 pb-10" {...STAGGER_CONTAINER_CONFIG}>
        <AnimatePresence mode="wait">
          {activities?.map((activity) => (
            <motion.div key={activity.id} variants={STAGGER_CHILD_VARIANTS}>
              {(() => {
                switch (activity.type) {
                  case ActivityTypes.Climbing:
                    return (
                      <ActivityCardClimbing
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  case ActivityTypes.Calisthenics:
                    return (
                      <ActivityCardCalisthenics
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  case ActivityTypes.Stretching:
                    return (
                      <ActivityCardStretching
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  case ActivityTypes.Hangboard:
                    return (
                      <ActivityCardHangboard
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  case ActivityTypes.Gym:
                    return (
                      <ActivityCardGym
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  case ActivityTypes.Driving:
                    return (
                      <ActivityCardDriving
                        activity={activity}
                        onEdit={() => onEditActivity(activity)}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </motion.div>
          ))}

          {activities?.length === 0 && (
            <motion.div variants={STAGGER_CHILD_VARIANTS}>
              <div className="border p-4 bg-white rounded-xl">
                <span className="text-sm font-medium text-stone-600">
                  No activities logged for this date
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default ActivitiesList;