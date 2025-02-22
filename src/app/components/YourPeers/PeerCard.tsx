import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ActivityType } from '@/types/Activity';
import { User } from '@/types/User';
import { format } from 'date-fns';
import UserProfilePicture from './UserProfilePicture';

interface PeerCardProps {
  user: User;
  userActivities: ActivityType[];
  onSelectPeer: () => void;
}

const PeerCard = ({ user, userActivities, onSelectPeer }: PeerCardProps) => {
  const lastActivity = userActivities.sort(
    (a, b) =>
      new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
  )[0];

  return (
    <div
      key={user.id}
      className={cn(
        'flex justify-between relative shrink-0 p-4',
        'bg-gradient-to-tr from-stone-50 via-stone-200 to-stone-50 rounded-3xl cursor-pointer shadow'
      )}
      onClick={() => onSelectPeer()}
    >
      <div
        className={cn('absolute z-10 inset-0.5 bg-stone-100 rounded-[1.4rem]')}
      />
      <div className="z-20 flex items-center justify-center gap-6">
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
          {/* <p className="max-w-[20ch] break-words whitespace-pre-wrap text-sm first-letter:capitalize first-letter:text-emerald-600 first-letter:text-lg first-letter:font-semibold ">
            {user?.bio}
          </p> */}

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
          </div>
          <div className="space-y-0.5">
            <p className="text-sm">{userActivities.length} activities logged</p>
            <p className="text-xs">
              Last activity{' '}
              {lastActivity && format(lastActivity.activityDate, 'do MMM yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerCard;
