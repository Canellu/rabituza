import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define the action interface
interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

// Define our own complete notification options interface
interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
  vibrate?: number[];
  // Add other standard notification properties as needed
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  tag?: string;
  silent?: boolean;
  requireInteraction?: boolean;
}

// Our custom interface with required fields
interface CustomNotificationOptions {
  title: string; // Required in our implementation
  body: string; // Required in our implementation
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: NotificationAction[];
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<
    NotificationPermission | 'default'
  >('default');
  const [supported, setSupported] = useState<boolean>(false);

  useEffect(() => {
    if ('Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!supported) {
      toast.error('Notifications are not supported in your browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('Notification permission granted');
        return true;
      } else {
        toast.error('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };
  // In the showNotification function, update the notification options
  // In the showNotification function, we can improve error handling
  const showNotification = async (
    options: CustomNotificationOptions
  ): Promise<boolean> => {
    if (!supported) {
      toast.error('Notifications are not supported in your browser');
      return false;
    }
  
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }
  
    try {
      // Check if service worker is registered before proceeding
      if (!('serviceWorker' in navigator)) {
        toast.error('Service Worker is not supported in your browser');
        return false;
      }
      
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/android/android-launchericon-192-192.png',
        badge: options.badge || '/android/android-launchericon-96-96.png',
        data: options.data || {},
        actions: options.actions || [],
        vibrate: [100, 50, 100],
      } as NotificationOptions);
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      toast.error('Failed to show notification');
      return false;
    }
  };

  const scheduleNotification = async (
    options: CustomNotificationOptions,
    delay: number
  ): Promise<boolean> => {
    if (!supported) {
      toast.error('Notifications are not supported in your browser');
      return false;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    try {
      setTimeout(() => {
        showNotification(options);
      }, delay);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('Failed to schedule notification');
      return false;
    }
  };

  return {
    supported,
    permission,
    requestPermission,
    showNotification,
    scheduleNotification,
  };
};

export default useNotifications;
