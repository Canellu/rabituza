"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const title = usePathname();
  return (
    <h1 className="text-xl font-bold tracking-wide capitalize">
      {title.slice(1)}
    </h1>
  );
};

export default PageTitle;
