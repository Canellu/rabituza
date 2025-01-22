'use client';

import { getUser } from '@/lib/database/user/get';
import {
  LogoutLink,
  useKindeBrowserClient,
} from '@kinde-oss/kinde-auth-nextjs';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import EditProfile from './EditProfile';
import RefreshButton from './RefreshButton';
import Spinner from './Spinner';

const Profile = () => {
  const { user } = useKindeBrowserClient();

  const userId = user?.id; // Handle possible null user here

  const {
    data: dbUser,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: !!userId,
  });

  if (isLoading || !dbUser)
    return (
      <div className="flex items-center justify-center flex-col grow gap-8">
        <Spinner />
        <span className="text-stone-500">Fetching user profile...</span>
      </div>
    );
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="flex items-center justify-between flex-col h-full gap-6">
      <div className="flex items-center flex-col gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col gap-4 size"
        >
          {user?.picture && (
            <Image
              src={user.picture}
              width={64}
              height={64}
              alt="profile_picture"
              className="rounded-full ring-primary/70 ring ring-offset-2 mt-4"
            />
          )}
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold">
              {dbUser.username
                ? dbUser.username
                : `${dbUser.first_name} ${dbUser.last_name}`}
            </span>
            <span className="text-stone-500 text-xs">{dbUser.email}</span>
          </div>
          <EditProfile />
        </motion.div>
      </div>

      {dbUser.age && <div>Age: {dbUser.age}</div>}
      {dbUser.height && <div>Height: {dbUser.height} cm</div>}
      {dbUser.bio && <div>{dbUser.bio}</div>}

      <div className="flex flex-col gap-4">
        <RefreshButton />
        <LogoutLink className="border border-primary rounded-full px-4 py-2 text-sm items-center justify-center flex">
          Log out
        </LogoutLink>
      </div>
    </div>
  );
};

export default Profile;
