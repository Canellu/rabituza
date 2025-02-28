'use client';

import Leaderboard from './Leaderboard/Leaderboard';
import NotificationTest from './NotificationTest';
import ToughestCountdown from './ToughestCountdown';

const Home = () => {
  return (
    <div className="p-6 flex flex-col gap-8 pb-10">
      <ToughestCountdown />

      <NotificationTest />

      <Leaderboard />
    </div>
  );
};

export default Home;
