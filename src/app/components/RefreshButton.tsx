"use client"; // This is necessary to indicate that the component runs on the client-side

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const RefreshButton: React.FC = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <Button onClick={handleRefresh}>Refresh Content</Button>;
};

export default RefreshButton;
