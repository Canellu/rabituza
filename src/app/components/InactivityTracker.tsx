'use client';

import { useInactivityNotification } from '@/lib/hooks/useInactivityNotification';

export const InactivityTracker = () => {
  // This hook will handle all the inactivity tracking logic
  useInactivityNotification();
  
  // This component doesn't render anything
  return null;
};

export default InactivityTracker;