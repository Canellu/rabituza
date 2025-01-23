'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/types/UserProfile';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import EditProfile from './EditProfile';
import RefreshButton from './RefreshButton';
import Spinner from './Spinner';

const Profile = () => {
  const { user: dbUser, loading, error, logout } = useAuth();

  const user = dbUser as User;

  if (loading || !user)
    return (
      <div className="flex items-center justify-center flex-col grow gap-8">
        <Spinner />
        <span className="text-stone-500">Fetching user profile...</span>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

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
              {user.username
                ? user.username
                : `${user.first_name} ${user.last_name}`}
            </span>
            <span className="text-stone-500 text-xs">{user.email}</span>
          </div>
          <EditProfile />
        </motion.div>
      </div>

      {user.height && <div>Height: {user.height} cm</div>}
      {user.bio && <div>{user.bio}</div>}

      <div className="flex flex-col gap-4">
        <RefreshButton />
        <Button
          onClick={logout}
          className="border border-primary rounded-full px-4 py-2 text-sm items-center justify-center flex"
        >
          Log out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
