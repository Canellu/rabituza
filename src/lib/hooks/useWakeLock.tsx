import { useEffect, useState } from 'react';

const useWakeLock = (isActive: boolean) => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if (!('wakeLock' in navigator)) {
        console.log('Wake Lock API not supported');
        return;
      }

      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        console.log('Wake Lock is active');
      } catch (err) {
        console.error('Wake Lock request failed:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock) {
        try {
          await wakeLock.release();
          setWakeLock(null);
          console.log('Wake Lock released');
        } catch (err) {
          console.error('Failed to release Wake Lock:', err);
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isActive, wakeLock]);

  return wakeLock;
};

export default useWakeLock;
