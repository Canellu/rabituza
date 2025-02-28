// Service Worker for Rabituza PWA

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async function () {
      return await self.clients.claim();
    })()
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  event.waitUntil(
    (async function () {
      const data = event.data.json();
      const options = {
        body: data.body || 'New notification',
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-96-96.png',
        data: data.data || {},
        actions: data.actions || [],
        vibrate: [100, 50, 100],
      };

      return await self.registration.showNotification(
        data.title || 'Rabituza',
        options
      );
    })()
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    (async function () {
      event.notification.close();

      // Handle notification click - navigate to specific URL if provided
      if (event.notification.data && event.notification.data.url) {
        return await clients.openWindow(event.notification.data.url);
      } else {
        return await clients.openWindow('/');
      }
    })()
  );
});
