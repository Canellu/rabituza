'use client';

import { getUser } from '@/lib/database/user/get';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import EditProfile from './EditProfile';
import LogoutButton from './LogoutButton';
import RefreshButton from './RefreshButton';

const Profile = () => {
  const [editable, setEditable] = useState(false);

  const userId = getSession();
  const { data: user, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is null');
      }
      return getUser(userId);
    },
    enabled: !!userId, // Ensure query only runs when userId is truthy
  });

  return (
    <div className="flex items-center justify-between flex-col h-full gap-6">
      <div className="flex items-center flex-col gap-4 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col gap-4 size w-full"
        >
          {user?.picture ? (
            <Image
              src={user.picture}
              width={64}
              height={64}
              alt="profile_picture"
              className="rounded-full ring-primary/70 ring ring-offset-2 mt-4"
            />
          ) : (
            <Image
              src="https://picsum.photos/200"
              alt="Profile picture"
              priority
              width={96}
              height={96}
              className="w-24 h-24 rounded-full"
            />
          )}
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-semibold">
              {user?.username
                ? user?.username
                : `${user?.first_name} ${user?.last_name}`}
            </span>
            <span className="text-stone-500 text-xs">{user?.email}</span>
          </div>
          <EditProfile editable={editable} setEditable={setEditable} />
        </motion.div>
      </div>

      {user?.height && <div>Height: {user?.height} cm</div>}
      {user?.bio && <div>{user?.bio}</div>}

      <div className="flex flex-col gap-4">
        <RefreshButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;
