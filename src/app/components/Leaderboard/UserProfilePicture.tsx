import { cn } from '@/lib/utils';
import { getGradientClass } from '@/lib/utils/getGradientClass';
import { User } from '@/types/User';
import Image from 'next/image';

interface UserProfilePictureProps {
  user: User;
  isFirst?: boolean;
}

const UserProfilePicture = ({ user, isFirst }: UserProfilePictureProps) => {
  if (user.avatar) {
    return (
      <Image
        src={user.avatar}
        alt="User Avatar"
        width={128}
        height={128}
        className={cn(
          'rounded-full object-cover size-10 border border-stone-400',
          isFirst && 'border-emerald-500'
        )}
      />
    );
  }

  const initial = (
    user.username?.[0] ||
    user.first_name?.[0] ||
    '?'
  ).toUpperCase();

  return (
    <div
      className={cn(
        'flex items-center justify-center size-20 rounded-full bg-gradient-to-b',
        'from-blue-100 to-blue-800',
        'from-emerald-100 to-emerald-800',
        'from-violet-100 to-violet-800',
        'from-amber-100 to-amber-800',
        'from-rose-100 to-rose-800',
        getGradientClass()
      )}
    >
      <span className="text-4xl font-bold text-white inter">{initial}</span>
    </div>
  );
};

export default UserProfilePicture;
