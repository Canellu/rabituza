import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import UserProfilePicture from './UserProfilePicture';

interface UserCardProps {
  user: User & { score: number };
  userActivities: ActivityType[];
  rank: number;
  onSelect: () => void;
}

const UserCard = ({
  user,
  rank,
  userActivities: _,
  onSelect,
}: UserCardProps) => {
  return (
    <div
      key={user.id}
      className={cn(
        'grid grid-cols-5 items-center gap-2',
        'border rounded-xl border-stone-300',
        'p-4 bg-white shadow',
        rank === 0 && 'bg-emerald-50 border-emerald-300'
      )}
      onClick={() => onSelect()}
    >
      <span
        className={cn(
          'font-bold text-stone-700 tracking-tight',
          rank === 0 && 'text-emerald-500 text-lg'
        )}
      >
        # {rank + 1}
      </span>
      <div className="z-20 flex items-center justify-start gap-4 col-span-3">
        <UserProfilePicture user={user} />
        <p className={cn('first-letter:capitalize font-medium text-stone-700')}>
          {user.username}
        </p>
      </div>
      <span className={cn('text-stone-700 text-sm font-medium text-end')}>
        {user.score}
      </span>
    </div>
  );
};

export default UserCard;
