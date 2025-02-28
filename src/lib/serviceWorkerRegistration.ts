export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);

      // Register service worker
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );
      console.log(
        'ServiceWorker registration successful with scope: ',
        registration.scope
      );
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed: ', error);
    }
  }
}

export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    return registration.unregister();
  }
  return false;
}
