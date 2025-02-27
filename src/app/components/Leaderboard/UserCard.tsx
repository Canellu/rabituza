import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { GiCrown } from 'react-icons/gi';
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
  const isFirst = rank === 0;
  return (
    <div
      key={user.id}
      className={cn(
        'grid grid-cols-5 items-center gap-2',
        'border rounded-xl border-stone-100',
        'p-4 bg-white shadow',
        isFirst &&
          'bg-amber-50 border-amber-200 py-5 border-2 shadow-amber-300/20 shadow-xl',
        'relative overflow-hidden'
      )}
      onClick={() => onSelect()}
    >
      <span
        className={cn(
          'font-bold text-stone-700 tracking-tight',
          isFirst && 'text-amber-700 text-lg'
        )}
      >
        # {rank + 1}
      </span>
      <div className="z-20 flex items-center justify-start gap-4 col-span-3">
        <div className="relative shrink-0">
          {rank == 0 && (
            <GiCrown className="absolute -top-3.5 -left-1.5 -rotate-[32deg] text-amber-400 text-3xl" />
          )}
          <UserProfilePicture user={user} />
        </div>
        <p
          className={cn(
            'first-letter:capitalize font-medium text-stone-700',
            isFirst && 'text-amber-700 font-semibold'
          )}
        >
          {user.username}
          {isFirst && (
            <span
              className={cn(
                'line-clamp-1 text-xs ',
                isFirst && 'text-amber-700'
              )}
            >
              {user?.bio}
            </span>
          )}
        </p>
      </div>
      <span
        className={cn(
          'text-stone-700 text-sm font-medium text-end',
          isFirst && 'text-amber-700 font-bold text-lg'
        )}
      >
        {user.score}
      </span>
    </div>
  );
};

export default UserCard;
