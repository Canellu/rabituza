import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';

const DRIVING_DB = 'drivingData';

export const initDB = async () => {
  try {
    // Test IndexedDB availability
    const testRequest = indexedDB.open('test');
    await new Promise((resolve, reject) => {
      testRequest.onerror = () => reject(new Error('IndexedDB not available'));
      testRequest.onsuccess = () => {
        testRequest.result.close();
        resolve(true);
      };
    });

    return await openDB(DRIVING_DB, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations', {
            keyPath: 'timestamp',
          });
        }
      },
      blocked() {
        throw new Error('Database blocked - another version is open');
      },
      blocking() {
        throw new Error('Database blocking - newer version attempting to open');
      },
      terminated() {
        throw new Error('Database terminated unexpectedly');
      },
    });
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    throw error;
  }
};

export const estimateDrivingDataSize = async (): Promise<number> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  const sizeInBytes = locations.reduce((total, location) => {
    return total + new Blob([JSON.stringify(location)]).size;
  }, 0);
  return sizeInBytes;
};

// Update other functions to use initDB
export const countDrivingDataEntries = async (): Promise<number> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const count = await store.count();
  return count;
};

export const getAllLocationsFromDB = async (): Promise<GeoLocation[]> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  return locations;
};

export const getLocationsBySessionId = async (sessionId: string): Promise<GeoLocation[]> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const allLocations = await store.getAll();
  return allLocations.filter(location => location.sessionId === sessionId);
};

export const deleteEntriesByDate = async (date: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readwrite');
  const store = tx.objectStore('locations');

  const allKeys = await store.getAllKeys();
  for (const key of allKeys) {
    const entry = await store.get(key);
    const entryDate = new Date(entry.timestamp).toLocaleDateString();
    if (entryDate === date) {
      await store.delete(key);
    }
  }

  await tx.done;
};
