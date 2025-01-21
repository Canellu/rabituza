"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./Spinner";

const RefreshButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.refresh();
      setIsLoading(false);
    }, 250);
  };

  return (
    <Button className="rounded-full" onClick={handleRefresh}>
      {isLoading ? (
        <>
          <Spinner color="text-stone-800" /> Refreshing...
        </>
      ) : (
        "Refresh Content"
      )}
    </Button>
  );
};

export default RefreshButton;
