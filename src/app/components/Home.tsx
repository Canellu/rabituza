'use client';

import { getActivities } from '@/lib/database/activities/getActivities';
import { useQuery } from '@tanstack/react-query';

import ToughestCountdown from './ToughestCountdown';
import YourPeers from './YourPeers/YourPeers';

const Home = () => {
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  });

  return (
    <div className="flex flex-col gap-12 pb-10">
      <ToughestCountdown />

      {activities && <YourPeers activities={activities} />}

      {/* Calisthenics Card */}
      {/* <div className="border rounded-xl p-4 bg-white flex flex-col gap-2">
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
        {isLoadingActivities ? (
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
      </div> */}
    </div>
  );
};

export default Home;
