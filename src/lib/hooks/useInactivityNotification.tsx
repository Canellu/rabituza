import { useEffect } from 'react';
import useNotifications from './useNotifications';

// Time constants (in milliseconds)
const TWO_DAYS = 1000 * 30;
// const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export const useInactivityNotification = () => {
  const { showNotification } = useNotifications();

  useEffect(() => {
    // Check if we need to show an inactivity notification
    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivityTimestamp');
      const currentTime = Date.now();

      if (!lastActivity) {
        // First time user, just set the timestamp
        localStorage.setItem('lastActivityTimestamp', currentTime.toString());
        return;
      }

      const lastActivityTime = parseInt(lastActivity, 10);
      const timeSinceLastActivity = currentTime - lastActivityTime;

      if (timeSinceLastActivity >= TWO_DAYS) {
        showNotification({
          title: "Don't be lazy!",
          body: "It's been a while since you tracked any activity in Rabituza.",
          data: {
            url: '/',
            source: 'inactivity',
          },
        });
      }

      // Update timestamp for this visit
      localStorage.setItem('lastActivityTimestamp', currentTime.toString());
    };

    // Only check when the app loads
    checkInactivity();
  }, [showNotification]);
};

export default useInactivityNotification;
