// Service Worker for Rabituza PWA

// Store for runtime tracking
let checkIntervalId = null;

// IndexedDB setup
const DB_NAME = 'inactivityTracking';
const STORE_NAME = 'inactivityData';
const DB_VERSION = 1;

// Open database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save inactivity data
async function saveInactivityData(lastVisitTime, threshold) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  store.put(lastVisitTime, 'lastVisitTime');
  store.put(threshold, 'threshold');

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Get inactivity data
async function getInactivityData() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);

  const [lastVisitTime, threshold] = await Promise.all([
    new Promise((resolve) => {
      const request = store.get('lastVisitTime');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    }),
    new Promise((resolve) => {
      const request = store.get('threshold');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    }),
  ]);

  return { lastVisitTime, threshold };
}

// Clear inactivity data
async function clearInactivityData() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  store.delete('lastVisitTime');
  store.delete('threshold');

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

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

// Message event - handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'APP_VISIT') {
    // Save the visit data to IndexedDB
    saveInactivityData(event.data.timestamp, event.data.threshold);

    // Set up periodic checks if not already running
    if (!checkIntervalId) {
      checkIntervalId = setInterval(checkInactivity, 10 * 1000); // Check every 10 seconds
    }
  }
});

// Inactivity check function
async function checkInactivity() {
  // Get data from IndexedDB
  const { lastVisitTime, threshold } = await getInactivityData();

  if (!lastVisitTime || !threshold) return;

  const now = Date.now();
  const timeSinceLastVisit = now - lastVisitTime;

  if (timeSinceLastVisit >= threshold) {
    // Send notification for inactivity
    await self.registration.showNotification("Don't be lazy!", {
      body: "It's been a while since you visited Rabituza.",
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-96-96.png',
      data: {
        url: '/',
        source: 'inactivity',
      },
      vibrate: [100, 50, 100],
    });

    // Clear the check after sending notification
    clearInterval(checkIntervalId);
    checkIntervalId = null;
    await clearInactivityData();
  }
}

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
