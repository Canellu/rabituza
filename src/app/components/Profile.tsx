'use client';

import { Button } from '@/components/ui/button';
import { getUser } from '@/lib/database/user/getUser';
import { getSession } from '@/lib/utils/userSession';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserPen } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import EditProfile from './EditProfile';
import LogoutButton from './LogoutButton';
import ProfileDetails from './ProfileDetails';
import RefreshButton from './RefreshButton';
import Spinner from './Spinner';

const Profile = () => {
  const [editable, setEditable] = useState(false);

  const userId = getSession();
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
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
        <div className="flex flex-col gap-4">
          <RefreshButton />
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between flex-col h-full gap-8 py-10">
      <div className="flex items-center flex-col gap-4 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-col gap-4 size w-full"
        >
          <Image
            src={user?.picture || `https://picsum.photos/seed/${user?.id}/200`}
            width={96}
            height={96}
            alt="profile_picture"
            className="rounded-full object-contain"
          />

          {(user?.username || user?.first_name || user?.last_name) && (
            <div className="flex flex-col items-center gap-2 text-stone-800">
              <span className="text-3xl font-semibold capitalize">
                {user?.username
                  ? user?.username
                  : `${user?.first_name} ${user?.last_name}`}
              </span>
              <span className="text-stone-500 text-sm">{user?.email}</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-6">
        <Button
          onClick={() => setEditable((prev) => !prev)}
          variant="outline"
          className="place-self-center"
        >
          <UserPen />
          Edit profile
        </Button>
        <EditProfile editable={editable} setEditable={setEditable} />
      </div>

      <ProfileDetails user={user} />

      <div className="flex flex-col gap-4">
        <RefreshButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Profile;
