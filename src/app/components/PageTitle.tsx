"use client";

import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

const PageTitle = () => {
  const title = usePathname();
  return (
    <>
      <h1 className="text-xl font-bold tracking-wide capitalize">
        {title.slice(1)}
      </h1>
      <Separator className="mt-2 mb-4" />
    </>
  );
};

export default PageTitle;
