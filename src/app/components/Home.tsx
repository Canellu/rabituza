'use client';

import { CALISTHENICS_EXERCISES } from '@/constants/calisthenicsExercises';
import { getActivities } from '@/lib/database/activities/getActivities';
import { formatDuration } from '@/lib/utils/time';
import { ActivityTypes, CalisthenicsExerciseType } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import ToughestCountdown from './ToughestCountdown';

const Home = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  });

  const counts = activities?.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = activities?.length || 0;

  // Filter calisthenics activities
  const calisthenicsActivities = activities?.filter(
    (activity) => activity.type === ActivityTypes.Calisthenics
  );

  // Calculate total reps or duration for each exercise
  const exerciseStats = calisthenicsActivities?.reduce((acc, activity) => {
    activity.exercises.forEach((exercise: CalisthenicsExerciseType) => {
      const totalReps = exercise.setGroups.reduce(
        (sum, setGroup) => sum + (setGroup.reps || 0),
        0
      );
      const totalDuration = exercise.setGroups.reduce(
        (sum, setGroup) => sum + (setGroup.duration || 0) * setGroup.sets,
        0
      );

      if (totalDuration > 0) {
        acc[exercise.name] = {
          type: 'duration',
          value: (acc[exercise.name]?.value || 0) + totalDuration,
        };
      } else {
        acc[exercise.name] = {
          type: 'reps',
          value: (acc[exercise.name]?.value || 0) + totalReps,
        };
      }
    });
    return acc;
  }, {} as Record<string, { type: string; value: number }>);

  const calisthenicsSessionCount = calisthenicsActivities?.length || 0;

  return (
    <div className="flex flex-col gap-12 pb-10">
      <ToughestCountdown />

      {/* Calisthenics Card */}
      <div className="border rounded-xl p-4 bg-white flex flex-col gap-2">
        <div className="flex gap-4 items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Calisthenics Summary</h2>
            <p className="text-stone-600 text-xs">
              Total stats for all users on Rabituza
            </p>
          </div>
          <div className="flex flex-col items-center justify-center border-2 px-4 pt-3 pb-2 rounded-xl">
            <span className="text-5xl font-bold text-primary">
              {calisthenicsSessionCount}
            </span>
            <span className="uppercase text-xs font-bold text-stone-700">
              Sessions
            </span>
          </div>
        </div>
        <section className="flex flex-col gap-2">
          {exerciseStats &&
            Object.entries(exerciseStats)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([exercise, { type, value }]) => {
                return (
                  <div
                    key={exercise}
                    className="text-sm border rounded-md w-full bg-white flex items-center justify-between"
                  >
                    <div className="bg-stone-50 whitespace-nowrap px-4 py-2 border-r">
                      {CALISTHENICS_EXERCISES[
                        exercise as keyof typeof CALISTHENICS_EXERCISES
                      ]?.name || exercise}
                    </div>
                    <div className="bg-white w-full flex-grow px-4 h-full text-end font-semibold text-stone-700">
                      {type === 'duration'
                        ? formatDuration(value)
                        : `${value} reps`}
                    </div>
                  </div>
                );
              })}
        </section>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold">Activity Counts</h2>
        {isLoading ? (
          <p>Loading activities...</p>
        ) : (
          <ul className="list-disc pl-5">
            <li className="text-sm font-semibold">
              Total Activities: {totalCount}
            </li>
            {counts &&
              Object.entries(counts).map(([type, count]) => {
                return (
                  <li key={type} className="text-sm">
                    {type}: {count}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
