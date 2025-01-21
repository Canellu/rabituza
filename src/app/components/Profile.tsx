"use client";

import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import RefreshButton from "./RefreshButton";
import Spinner from "./Spinner";

const Profile = () => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="flex items-center flex-col gap-4h-full">
      {!user?.picture ? (
        <Spinner
          size="size-8"
          className="size-24 place-items-center place-content-center"
        />
      ) : (
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

      <RefreshButton />
    </div>
  );
};

export default Profile;
