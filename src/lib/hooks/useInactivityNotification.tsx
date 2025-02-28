import { useEffect } from 'react';

// Time constants (in milliseconds)
const THIRTY_SECONDS = 1000 * 30; // For testing
// const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

export const useInactivityNotification = () => {
  useEffect(() => {
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Notify service worker about app visit
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'APP_VISIT',
        timestamp: Date.now(),
        threshold: THIRTY_SECONDS,
      });
    }
  }, []);
};

export default useInactivityNotification;
