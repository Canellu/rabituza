"use client";

import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import RefreshButton from "./RefreshButton";
import Spinner from "./Spinner";

const Profile = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="flex items-center justify-evenly flex-col h-full">
      <div className="flex items-center flex-col gap-4">
        {!user ? (
          <Spinner
            size="size-10"
            className="size-[168px] flex items-center justify-center"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center flex-col gap-4 size"
          >
            {user?.picture && (
              <Image
                src={user.picture}
                width={96}
                height={96}
                alt="profile_picture"
                className="rounded-lg"
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-semibold">
                {user?.given_name} {user?.family_name}
              </span>
              <span className="text-zinc-600 text-sm">{user?.email}</span>
            </div>
          </motion.div>
        )}
        <LogoutLink className="bg-primary rounded-full px-6 py-3 font-medium">
          Log out
        </LogoutLink>
      </div>

      <RefreshButton />
    </div>
  );
};

export default Profile;
