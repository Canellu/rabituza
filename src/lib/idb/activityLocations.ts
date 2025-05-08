import { GeoLocation } from '@/types/Activity';
import { IDBPDatabase, openDB } from 'idb';
import { toast } from 'sonner';

const ACTIVITY_LOCATIONS_DB = 'activityLocations';
let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(ACTIVITY_LOCATIONS_DB, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('locations')) {
          db.createObjectStore('locations', {
            keyPath: 'timestamp',
          });
        }
      },
      blocked() {
        console.error('Database blocked - another version is open');
        toast.error('Database blocked - another version is open');
      },
      blocking() {
        console.error('Database blocking - newer version attempting to open');
        toast.error('Database blocking - newer version attempting to open');
      },
      terminated() {
        console.error('Database terminated unexpectedly');
        toast.error('Database terminated unexpectedly');
      },
    });
  }
  return dbPromise;
};

export const getDBConnection = async (): Promise<IDBPDatabase> => {
  return await initDB();
};

export const estimateGeolocationDataSize = async (): Promise<number> => {
  const db = await getDBConnection();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  const sizeInBytes = locations.reduce((total, location) => {
    return total + new Blob([JSON.stringify(location)]).size;
  }, 0);
  return sizeInBytes;
};

export const getAllLocationsFromDB = async (): Promise<GeoLocation[]> => {
  const db = await getDBConnection();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  return locations;
};

export const deleteEntriesByDate = async (date: string): Promise<void> => {
  const db = await getDBConnection();
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

export const clearAllLocations = async (): Promise<void> => {
  const db = await getDBConnection();
  const tx = db.transaction('locations', 'readwrite');
  const store = tx.objectStore('locations');
  const allKeys = await store.getAllKeys();
  for (const key of allKeys) {
    await store.delete(key);
  }
  await tx.done;
};
