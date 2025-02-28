'use client';

import { Button } from '@/components/ui/button';
import useNotifications from '@/lib/hooks/useNotifications';
import { Bell } from 'lucide-react';

const NotificationTest = () => {
  const {
    supported,
    permission,
    requestPermission,
    showNotification,
    scheduleNotification,
  } = useNotifications();

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleShowNotification = async () => {
    console.log('Show notification clicked');
    await showNotification({
      title: 'Rabituza',
      body: 'This is a test notification from Rabituza!',
      data: {
        url: '/dashboard',
      },
    });
  };

  // Add a function to test scheduled notifications
  const handleScheduleNotification = async () => {
    console.log('Sehcduled notification');
    await scheduleNotification(
      {
        title: 'Scheduled Notification',
        body: 'This notification was scheduled to appear 5 seconds later!',
        data: {
          url: '/dashboard',
        },
      },
      5000 // 5 seconds delay
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-center">
      <div className="flex items-center gap-2 justify-center">
        <Bell className="h-5 w-5" />
        <span>
          Notification Status: {supported ? 'Supported' : 'Not Supported'}
        </span>
      </div>

      {supported && (
        <>
          <div>Current Permission: {permission}</div>

          <div className="flex flex-col gap-2">
            {permission !== 'granted' && (
              <Button
                onClick={handleRequestPermission}
                variant="outline"
                className="w-full"
              >
                Request Permission
              </Button>
            )}

            {permission === 'granted' && (
              <>
                <Button
                  onClick={handleShowNotification}
                  variant="default"
                  className="w-full"
                >
                  Test Notification
                </Button>
                <Button
                  onClick={handleScheduleNotification}
                  variant="outline"
                  className="w-full"
                >
                  Test Scheduled Notification
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationTest;
