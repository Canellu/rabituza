import { Progress } from '@/components/ui/progress';
import ScrollShadow from '@/components/ui/ScrollShadow';
import { getUsers } from '@/lib/database/user/getUsers';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType } from '@/types/Activity';
import { useQuery } from '@tanstack/react-query';
import { format, subWeeks } from 'date-fns'; // Import subWeeks to calculate the date one week ago
import UserProfilePicture from './UserProfilePicture';

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
            const lastActivity = userActivities.sort(
              (a, b) =>
                new Date(b.activityDate).getTime() -
                new Date(a.activityDate).getTime()
            )[0];

            return (
              <div
                key={user.id}
                className={cn(
                  'flex justify-between relative shrink-0 p-4',
                  'bg-gradient-to-tr from-stone-50 via-stone-200 to-stone-50 rounded-3xl cursor-pointer shadow'
                )}
              >
                <div
                  className={cn(
                    'absolute z-10 inset-0.5 bg-stone-100 rounded-[1.4rem]'
                  )}
                />
                <div className="z-20 flex items-center justify-center gap-8">
                  <div className="flex flex-col gap-4">
                    <UserProfilePicture user={user} />
                    <p
                      className={cn(
                        'text-center text-sm first-letter:capitalize border border-white/50',
                        'geist-mono font-semibold text-stone-800 tracking-wide border px-2 py-1 rounded-full',
                        'bg-gradient-to-br from-stone-100 to-stone-200 shadow-inner'
                      )}
                    >
                      {user.username}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-2 h-full">
                    <p className="max-w-[20ch] break-words whitespace-pre-wrap text-sm first-letter:capitalize first-letter:text-emerald-600 first-letter:text-lg first-letter:font-semibold ">
                      {user?.bio}
                    </p>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Lorem</span>
                      <Progress
                        value={50}
                        className={cn('w-full h-2 border border-stone-200')}
                        classNameIndicator={cn(
                          'bg-gradient-to-r rounded-r-full',
                          'from-emerald-700 to-emerald-300'
                        )}
                      />
                      <Progress
                        value={80}
                        className={cn('w-full h-2 border border-stone-200')}
                        classNameIndicator={cn(
                          'bg-gradient-to-r rounded-r-full',
                          'from-emerald-700 to-emerald-300'
                        )}
                      />
                      <Progress
                        value={20}
                        className={cn('w-full h-2 border border-stone-200')}
                        classNameIndicator={cn(
                          'bg-gradient-to-r rounded-r-full',
                          'from-emerald-700 to-emerald-300'
                        )}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm">
                        {userActivities.length} activities logged
                      </p>
                      <p className="text-xs">
                        Last activity{' '}
                        {lastActivity &&
                          format(lastActivity.activityDate, 'do MMM yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
};

export default YourPeers;
