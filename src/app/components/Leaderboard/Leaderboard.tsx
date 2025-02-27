import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getActivities } from '@/lib/database/activities/getActivities';
import { getUsers } from '@/lib/database/user/getUsers';
import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth, subWeeks } from 'date-fns';
import { Info } from 'lucide-react';
import { useState } from 'react';
import ActivityDistributionChart from './ActivityDistributionChart';
import AverageRatings from './AverageRatings';
import UserCard from './UserCard';
import UserMonth from './UserMonth';

const Leaderboard = () => {
  const dateFrom = startOfMonth(new Date());
  const dateTo = endOfMonth(new Date());
  const currentMonth = format(dateFrom, 'MMMM');

  const [selectedUser, setSelectedUser] = useState<{
    user: User & { activities: ActivityType[] };
    statistics: {
      totalActivities: number;
      averageIntensity: string;
      averageEnjoyment: string;
      averageEnergy: string;
    };
  } | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
  const { data: activities = [] } = useQuery({
    queryKey: ['activities', dateFrom, dateTo],
    queryFn: () => getActivities(dateFrom, dateTo),
  });

  const calculateUserStatistics = (userActivities: ActivityType[]) => {
    const totalActivities = userActivities.length;
    const totalIntensity = userActivities.reduce(
      (sum, activity) => sum + activity.ratings.intensity,
      0
    );
    const totalEnjoyment = userActivities.reduce(
      (sum, activity) => sum + activity.ratings.enjoyment,
      0
    );
    const totalEnergy = userActivities.reduce(
      (sum, activity) => sum + activity.ratings.energy,
      0
    );
    return {
      totalActivities,
      averageIntensity: (totalIntensity / totalActivities).toFixed(1),
      averageEnjoyment: (totalEnjoyment / totalActivities).toFixed(1),
      averageEnergy: (totalEnergy / totalActivities).toFixed(1),
    };
  };

  const handleSelectUserCard = (user: User) => {
    const userActivity = activities.filter(
      (activity) => activity.userId === user.id
    );
    const statistics = calculateUserStatistics(userActivity);
    setSelectedUser({
      user: { ...user, activities: userActivity },
      statistics,
    });
    setIsDialogOpen(true);
  };

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  const oneWeekAgo = subWeeks(new Date(), 1);

  const filteredUsers = users
    ?.filter((user) => {
      const userActivities = activities.filter(
        (activity) => activity.userId === user.id
      );
      const lastActivity = userActivities.sort(
        (a, b) =>
          new Date(b.activityDate).getTime() -
          new Date(a.activityDate).getTime()
      )[0];

      return lastActivity && new Date(lastActivity.activityDate) > oneWeekAgo;
    })
    .map((user) => {
      const userActivities = activities.filter(
        (activity) => activity.userId === user.id
      );
      const score = userActivities.length * 50;
      return { ...user, score };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-1">
        <span>Leaderboard - {currentMonth}</span>
        <Popover>
          <PopoverTrigger>
            <Info className="size-4 text-stone-500" />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <span className="font-medium">Score Calculation</span>
            <p className="text-sm text-muted-foreground">
              Scores are calculated based on the number of activities. Each
              activity contributes 50 points.
            </p>
          </PopoverContent>
        </Popover>
      </h2>
      <div className="grid grid-cols-5 px-3 text-sm font-medium text-stone-500">
        <span>Rank</span>
        <span className="col-span-3">Username</span>
        <span className="text-end">Score</span>
      </div>
      <div className={cn('flex flex-col gap-2', 'w-full text-stone-700')}>
        {filteredUsers?.map((user, index) => {
          const userActivities = activities.filter(
            (activity) => activity.userId === user.id
          );

          return (
            <UserCard
              key={user.id}
              user={user}
              rank={index}
              userActivities={userActivities}
              onSelect={() => handleSelectUserCard(user)}
            />
          );
        })}
      </div>

      {selectedUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg w-[96%] max-h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
            <DialogHeader>
              <DialogTitle className="first-letter:capitalize">
                {selectedUser.user.username ||
                  selectedUser.user.first_name +
                    ' ' +
                    selectedUser.user.last_name}
              </DialogTitle>
              <DialogDescription className="text-sm text-stone-500">
                {selectedUser.user.email}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4 flex flex-col gap-8">
                  <AverageRatings statistics={selectedUser.statistics} />
                  <ActivityDistributionChart
                    activities={selectedUser.user.activities}
                  />
                  <UserMonth user={selectedUser.user} />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Leaderboard;
