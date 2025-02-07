'use client';

import { getUser } from '@/lib/database/user/getUser';
import { cn } from '@/lib/utils';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ProfileDetails from './ProfileDetails';
import Spinner from './Spinner';

const getGradientClass = (userId: string) => {
  const gradients = [
    'from-emerald-300 to-emerald-800',
    'from-blue-400 to-blue-600',
    'from-violet-400 to-violet-600',
    'from-amber-400 to-amber-600',
    'from-rose-300 to-rose-600',
  ];

  const index = parseInt(userId) % gradients.length;
  return gradients[index];
};

const Profile = () => {
  const userId = getSession();
  const { data: user, isPending } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is null');
      }
      return getUser(userId);
    },
    enabled: !!userId, // Ensure query only runs when userId is truthy
  });

  if (isPending || !user) {
    return (
      <div className="flex items-center justify-between flex-col h-full gap-8 py-10">
        <div className="flex items-center justify-center flex-col gap-4 grow">
          <Spinner />
          <span className="text-stone-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between flex-col h-full gap-8 pt-4 pb-10">
      <div className="flex items-center flex-col gap-4 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col gap-3 size w-full"
        >
          <div
            className={cn(
              'flex items-center justify-center size-20 rounded-full bg-gradient-to-br',
              user?.id &&
                `from-emerald-300 to-emerald-800 from-blue-400 to-blue-600 from-violet-400 to-violet-600 from-amber-400 to-amber-600 from-rose-300 to-rose-600`,
              getGradientClass(user.id)
            )}
          >
            <span className="text-2xl font-bold text-white inter">
              {(
                user?.username?.[0] ||
                user?.first_name?.[0] ||
                '?'
              ).toUpperCase()}
            </span>
          </div>
          {(user?.username || user?.first_name || user?.last_name) && (
            <div className="flex flex-col items-center gap-1 text-stone-800">
              <span className="text-xl font-semibold capitalize">
                {user?.username
                  ? user?.username
                  : `${user?.first_name} ${user?.last_name}`}
              </span>
              <span className="text-stone-500 text-xs">{user?.email}</span>
            </div>
          )}
        </motion.div>
      </div>

      <ProfileDetails user={user} />

      <p className="geist-mono text-xs text-stone-500 text-center w-full pb-6 pt-12 ">
        <span className="px-2 py-1 border rounded-md bg-gradient-to-b from-stone-50 to-stone-200 border-white shadow-inner">
          App version: 1.0.0
        </span>
      </p>
    </div>
  );
};

export default Profile;
