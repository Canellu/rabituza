"use client";

import { cn } from "@/lib/utils";
import { BicepsFlexed, Goal, ListCheck, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Routes = [
  {
    name: "Tracker",
    path: "/tracker",
    icon: ListCheck,
  },
  {
    name: "Goals",
    path: "/goals",
    icon: Goal,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];

const Menu = () => {
  const currentPath = usePathname();
  return (
    <header className="">
      <Link href="#" className="flex items-center p-4">
        <div className="bg-black/5 p-3 rounded-full">
          <BicepsFlexed />
        </div>
        <span className="font-bold uppercase tracking-wide sr-only sm:not-sr-only">
          Rabituza
        </span>
      </Link>
      <div className="bg-zinc-900/80 backdrop-blur-sm gap-1 fixed inset-x-0 bottom-0 w-full flex items-center justify-around">
        {Routes.map((route) => {
          const isActive = currentPath === route.path;
          return (
            <Link
              href={route.path}
              key={route.name}
              className={cn(
                "px-4 py-3 transition duration-200 ease items-center justify-center flex flex-col font-semibold text-sm w-24",
                isActive
                  ? "text-lime-400 border-t-2 border-lime-400"
                  : "text-zinc-200"
              )}
            >
              <route.icon />
              {isActive && route.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Menu;
