"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RefreshButton = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <Button onClick={handleRefresh}>Refresh Content</Button>;
};

export default RefreshButton;
