import ScrollShadow from '@/components/ui/ScrollShadow';
import { getUsers } from '@/lib/database/user/getUsers';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { subWeeks } from 'date-fns'; // Import subWeeks to calculate the date one week ago
import PeerCard from './PeerCard';

interface YourPeersProps {
  activities: ActivityType[];
}

const YourPeers = ({ activities }: YourPeersProps) => {
  const userId = getSession();
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  const oneWeekAgo = subWeeks(new Date(), 1); // Calculate the date one week ago

  const filteredUsers = users?.filter((user) => {
    const userActivities = activities.filter(
      (activity) => activity.userId === user.id
    );
    const lastActivity = userActivities.sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    )[0];

    // Filter out users whose last activity is more than one week ago
    return (
      user.id !== userId &&
      lastActivity &&
      new Date(lastActivity.activityDate) > oneWeekAgo
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Active Peers{' '}
        <div
          className={cn(
            'relative',
            'bg-gradient-to-tr from-stone-50 via-stone-200 to-stone-50 rounded-md cursor-pointer shadow'
          )}
        >
          <div
            className={cn('absolute z-10 inset-0.5 bg-stone-100/50 rounded-sm')}
          />
          <div className="size-7 flex items-center justify-center">
            <p className="text-center z-20 text-lg">{filteredUsers?.length}</p>
          </div>
        </div>
      </h2>
      <ScrollShadow
        orientation="horizontal"
        className="w-full"
        size={20}
        hideScrollBar
      >
        <div className={cn('flex gap-4 w-full text-stone-700', 'p-2')}>
          {filteredUsers?.map((user) => {
            const userActivities = activities.filter(
              (activity) => activity.userId === user.id
            );

            return (
              <PeerCard
                key={user.id}
                user={user}
                userActivities={userActivities}
              />
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default YourPeers;
