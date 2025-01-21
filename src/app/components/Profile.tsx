"use client";

import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

const Profile = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="flex items-center border border-red-200 flex-col gap-4">
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

      <LogoutLink className="bg-primary rounded-full px-6 py-3 font-medium">
        Log out
      </LogoutLink>
    </div>
  );
};

export default Profile;
