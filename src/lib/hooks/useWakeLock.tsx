import { useEffect, useRef } from 'react';

const useWakeLock = (isActive: boolean) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      if (!('wakeLock' in navigator)) {
        console.log('Wake Lock API not supported');
        return;
      }
      // Avoid requesting if already locked
      if (wakeLockRef.current) {
        console.log('Wake Lock already active');
        return;
      }

      try {
        const lock = await navigator.wakeLock.request('screen');
        wakeLockRef.current = lock; // Store in ref
        console.log('Wake Lock is active');

        // Handle cases where the lock is released by the system
        lock.addEventListener('release', () => {
          console.log('Wake Lock was released by the system.');
          wakeLockRef.current = null; // Clear the ref
        });
      } catch (err) {
        // Ignore AbortError if the request is aborted (e.g., page visibility change)
        if ((err as DOMException).name !== 'AbortError') {
          console.error('Wake Lock request failed:', err);
        }
      }
    };

    const releaseWakeLock = async () => {
      // Check the ref's current value
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          console.log('Wake Lock released');
          // No need to remove the event listener here, it's on the released lock
        } catch (err) {
          // It's possible the lock was already released
          if ((err as DOMException).name !== 'NotFoundError') {
            console.error('Failed to release Wake Lock:', err);
          } else {
            console.log('Wake Lock was already released.');
          }
        } finally {
          wakeLockRef.current = null; // Always clear the ref after attempting release
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      // Release only if there's an active lock in the ref
      releaseWakeLock(); // releaseWakeLock already checks ref.current
    }

    // Cleanup function: always try to release on unmount or when isActive becomes false
    return () => {
      // Capture the current value for the async cleanup
      const lockToRelease = wakeLockRef.current;
      if (lockToRelease) {
        lockToRelease
          .release()
          .then(() => {
            console.log('Wake Lock released on cleanup');
            // Check if the ref still holds the same lock before nulling,
            // though usually not necessary in cleanup if component unmounts.
            if (wakeLockRef.current === lockToRelease) {
              wakeLockRef.current = null;
            }
          })
          .catch((err) => {
            if ((err as DOMException).name !== 'NotFoundError') {
              console.error('Failed to release Wake Lock on cleanup:', err);
            } else {
              // If already released, ensure ref is null
              if (wakeLockRef.current === lockToRelease) {
                wakeLockRef.current = null;
              }
            }
          });
      }
    };
  }, [isActive]);
};

export default useWakeLock;
