'use client';

import Leaderboard from './Leaderboard/Leaderboard';
import ToughestCountdown from './ToughestCountdown';

const Home = () => {
  return (
    <div className="p-6 flex flex-col gap-8 pb-10">
      <ToughestCountdown />
      <Leaderboard />
    </div>
  );
};

export default Home;
