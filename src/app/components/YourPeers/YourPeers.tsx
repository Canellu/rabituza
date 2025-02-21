import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ScrollShadow from '@/components/ui/ScrollShadow';
import { getUsers } from '@/lib/database/user/getUsers';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { useQuery } from '@tanstack/react-query';
import { subWeeks } from 'date-fns'; // Import subWeeks to calculate the date one week ago
import { useState } from 'react';
import WorkInProgress from '../WorkInProgress';
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

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectPeer = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  const oneWeekAgo = subWeeks(new Date(), 1);

  const filteredUsers = users?.filter((user) => {
    const userActivities = activities.filter(
      (activity) => activity.userId === user.id
    );
    const lastActivity = userActivities.sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    )[0];

    return (
      user.id !== userId &&
      lastActivity &&
      new Date(lastActivity.activityDate) > oneWeekAgo
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Active Peers
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
                onSelectPeer={() => handleSelectPeer(user)}
              />
            );
          })}
        </div>
      </ScrollShadow>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-[96%] max-h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
          <DialogHeader>
            <DialogTitle className="first-letter:capitalize">
              {selectedUser?.username}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="flex-grow overflow-y-auto">
              <div className="h-full overflow-auto">
                <div className="p-4">
                  <WorkInProgress />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YourPeers;
