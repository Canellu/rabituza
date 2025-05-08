'use client';

import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/database/user/getUser';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import AvatarUpload from './AvatarUpload';
import ProfileDetails from './ProfileDetails';
import Spinner from './Spinner';

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
    <div className="px-6 flex items-center justify-between flex-col h-full gap-8 py-10">
      <div className="flex items-center flex-col gap-4 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col gap-3 size w-full"
        >
          <AvatarUpload user={user} />
          {(user?.username || user?.first_name || user?.last_name) && (
            <div className="flex flex-col items-center gap-1 text-stone-800 dark:text-stone-200">
              <span className="text-xl font-semibold capitalize">
                {user?.username
                  ? user?.username
                  : `${user?.first_name} ${user?.last_name}`}
              </span>
              <span className="text-stone-500 text-xs dark:text-stone-400">
                {user?.email}
              </span>
            </div>
          )}
        </motion.div>
      </div>

      <ProfileDetails user={user} />

      <Button
        asChild
        variant="outline"
        size="sm"
        className="bg-gradient-to-br  from-emerald-200 to-lime-200 text-stone-800 border border-white/50"
      >
        <Link href="/feedback" replace>
          Release Notes & Feedback
        </Link>
      </Button>

      <p className="geist-mono text-xs text-stone-500 text-center w-full pb-6">
        <span className="px-2 py-1 border rounded-md bg-gradient-to-b from-stone-50 to-stone-200 border-white shadow-inner dark:from-stone-700 dark:to-stone-900 dark:border-stone-600 dark:text-stone-300">
          App version: 1.0.0
        </span>
      </p>
    </div>
  );
};

export default Profile;
