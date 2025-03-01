import { Button } from '@/components/ui/button';
import useNotifications from '@/lib/hooks/useNotifications';
import { BellDot, BellPlus } from 'lucide-react';

const TestNotification = () => {
  const { supported, showNotification, requestPermission } = useNotifications();

  const sendNotification = async () => {
    if (!supported) {
      console.log('Notifications are not supported in this browser.');
      return;
    }
    await showNotification({
      title: 'Notification Test',
      body: 'Notification Body',
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-96-96.png',
      data: {},
      actions: [],
    });
  };

  const handleRequestPermission = () => {
    requestPermission();
  };

  return (
    <div className="space-x-2">
      <Button variant="secondary" size="icon" onClick={handleRequestPermission}>
        <BellPlus />
      </Button>
      <Button variant="outline" size="icon" onClick={sendNotification}>
        <BellDot />
      </Button>
    </div>
  );
};

export default TestNotification;
