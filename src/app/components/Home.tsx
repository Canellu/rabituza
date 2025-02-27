'use client';

import { getActivities } from '@/lib/database/activities/getActivities';
import { useQuery } from '@tanstack/react-query';

import Leaderboard from './Leaderboard/Leaderboard';
import ToughestCountdown from './ToughestCountdown';

const Home = () => {
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(),
  });

  return (
    <div className="p-6 flex flex-col gap-8 pb-10">
      <ToughestCountdown />
      {activities && <Leaderboard activities={activities} />}
    </div>
  );
};

export default Home;
