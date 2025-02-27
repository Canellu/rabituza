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
          'bg-emerald-50 border-emerald-200 py-5 border-2 shadow-emerald-300/20 shadow-xl',
        'relative overflow-hidden'
      )}
      onClick={() => onSelect()}
    >
      <span
        className={cn(
          'font-bold text-stone-700 tracking-tight',
          isFirst && 'text-emerald-700 text-lg'
        )}
      >
        # {rank + 1}
      </span>
      <div className="z-20 flex items-center justify-start gap-4 col-span-3">
        <div className="relative shrink-0">
          {rank == 0 && (
            <GiCrown className="absolute -top-3.5 -left-1.5 -rotate-[32deg] text-amber-400 text-3xl" />
          )}
          <UserProfilePicture user={user} isFirst={isFirst} />
        </div>
        <div>
          <p
            className={cn(
              'first-letter:capitalize font-medium text-stone-700',
              isFirst && 'text-emerald-700 font-semibold'
            )}
          >
            {user.username}
          </p>

          <span
            className={cn(
              'line-clamp-1 text-xs text-stone-500 ',
              isFirst && 'text-emerald-600'
            )}
          >
            {user?.bio}
          </span>
        </div>
      </div>
      <span
        className={cn(
          'text-stone-700 text-sm font-medium text-end',
          isFirst && 'text-emerald-700 font-bold text-lg'
        )}
      >
        {user.score}
      </span>
    </div>
  );
};

export default UserCard;
