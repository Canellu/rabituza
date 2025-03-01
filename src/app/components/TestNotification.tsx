import { Button } from '@/components/ui/button';
import useNotifications from '@/lib/hooks/useNotifications';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

const TestNotification = () => {
  const { supported, permission, requestPermission, showNotification } =
    useNotifications();

  const sendNotification = async () => {
    if (!supported) {
      console.log('Notifications are not supported in this browser.');
      return;
    }

    if (permission === 'granted') {
      await showNotification({
        title: 'Notification Test',
        body: 'Notification Body',
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-96-96.png',
        data: {},
        actions: [],
      });
    } else if (permission === 'denied') {
      console.log('Notifications are blocked by the user.');
      toast.error('Notifications are blocked by the user.');
    } else {
      const granted = await requestPermission();
      if (granted) {
        await showNotification({
          title: 'Notification Test',
          body: 'Notification Body',
          icon: '/android/android-launchericon-192-192.png',
          badge: '/android/android-launchericon-96-96.png',
          data: {},
          actions: [],
        });
      } else {
        console.log('Notifications permission denied.');
      }
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={sendNotification}>
      <Bell />
    </Button>
  );
};

export default TestNotification;
