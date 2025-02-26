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
    <div className="p-6 flex flex-col gap-12 pb-10">
      <ToughestCountdown />

      {activities && <YourPeers activities={activities} />}
    </div>
  );
};

export default Home;
