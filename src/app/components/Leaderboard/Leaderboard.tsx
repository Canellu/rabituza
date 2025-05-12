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
import { getUserActivities } from '@/lib/database/activities/getUserActivities';
import { getUsers } from '@/lib/database/user/getUsers';
import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import { Info } from 'lucide-react';
import { useState } from 'react';
import ActivityDistribution from './ActivityDistribution';
import AverageRatings from './AverageRatings';
import UserCard from './UserCard';
import UserMonth from './UserMonth';

const Leaderboard = () => {
  const dateFrom = startOfMonth(new Date());
  const dateTo = endOfMonth(new Date());
  const currentMonth = format(dateFrom, 'MMMM');
  const queryClient = useQueryClient();

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
  const { data: currentMonthActivities } = useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(dateFrom, dateTo),
  });

  const handleSelectUserCard = async (user: User) => {
    // Invalidate and refetch before setting the selected user
    await queryClient.invalidateQueries({ queryKey: ['activities', 'user'] });
    const activities = await getUserActivities(user.id);

    const statistics = {
      totalActivities: activities.length,
      averageIntensity: (
        activities.reduce(
          (sum, activity) => sum + activity.ratings.intensity,
          0
        ) / activities.length
      ).toFixed(1),
      averageEnjoyment: (
        activities.reduce(
          (sum, activity) => sum + activity.ratings.enjoyment,
          0
        ) / activities.length
      ).toFixed(1),
      averageEnergy: (
        activities.reduce((sum, activity) => sum + activity.ratings.energy, 0) /
        activities.length
      ).toFixed(1),
    };

    setSelectedUser({
      user: { ...user, activities },
      statistics,
    });
    setIsDialogOpen(true);
  };

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  const filteredUsers = users
    ?.filter((user) => {
      // Check if the user has any activities recorded for the current month
      const userActivities = currentMonthActivities?.filter(
        (activity) => activity.userId === user.id
      );
      // Include the user if they have one or more activities this month
      return userActivities && userActivities.length > 0;
    })
    .map((user) => {
      const userActivities = currentMonthActivities?.filter(
        (activity) => activity.userId === user.id
      );
      // Calculate score based on the number of activities this month
      const score = userActivities?.length ? userActivities.length * 50 : 0;
      return { ...user, score };
    })
    .sort((a, b) => {
      // First compare by score (higher scores first)
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // If scores are equal, check if either user is "Bao"
      if (a.username?.toLowerCase() === 'bao') return -1; // a is Bao, so a comes first
      if (b.username?.toLowerCase() === 'bao') return 1; // b is Bao, so b comes first

      // If neither is Bao or both are Bao, maintain original order
      return 0;
    });

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
      <div className="grid grid-cols-5 px-3 text-sm font-medium text-stone-500 dark:text-stone-400">
        <span>Rank</span>
        <span className="col-span-3">Username</span>
        <span className="text-end">Score</span>
      </div>
      <div className={cn('flex flex-col gap-2', 'w-full text-stone-700')}>
        {filteredUsers?.map((user, index) => {
          const userActivities = currentMonthActivities?.filter(
            (activity) => activity.userId === user.id
          );

          return (
            <UserCard
              key={user.id}
              user={user}
              rank={index}
              userActivities={userActivities || []}
              onSelect={() => handleSelectUserCard(user)}
            />
          );
        })}
      </div>

      {selectedUser && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg w-[96%] max-h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6 bg-stone-50 dark:bg-stone-900">
            <DialogHeader>
              <DialogTitle className="first-letter:capitalize">
                {selectedUser.user.username ||
                  selectedUser.user.first_name +
                    ' ' +
                    selectedUser.user.last_name}
              </DialogTitle>
              <DialogDescription className="text-sm text-stone-400">
                {selectedUser.user.email}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4 flex flex-col gap-6">
                  <AverageRatings statistics={selectedUser.statistics} />
                  <ActivityDistribution
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
