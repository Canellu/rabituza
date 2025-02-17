import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';

const DRIVING_DB = 'drivingData';

export const initDB = async () => {
  try {
    console.log('Attempting to open database:', DRIVING_DB);
    const db = await openDB(DRIVING_DB, 1, {
      upgrade(db) {
        console.log('Running database upgrade');
        if (!db.objectStoreNames.contains('locations')) {
          console.log('Creating locations store');
          db.createObjectStore('locations', {
            keyPath: 'timestamp',
          });
        }
      },
      blocked() {
        const error = new Error('Database blocked - another version is open');
        console.error(error);
        throw error;
      },
      blocking() {
        const error = new Error(
          'Database blocking - newer version attempting to open'
        );
        console.error(error);
        throw error;
      },
      terminated() {
        const error = new Error('Database terminated unexpectedly');
        console.error(error);
        throw error;
      },
    });

    console.log('Database opened successfully');
    return db;
  } catch (error) {
    // Enhanced error logging
    console.error('Failed to initialize IndexedDB:', {
      error,
      type: error instanceof Error ? 'Error' : typeof error,
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
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

export const getLocationsBySessionId = async (
  sessionId: string
): Promise<GeoLocation[]> => {
  const db = await initDB();
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const allLocations = await store.getAll();
  return allLocations.filter((location) => location.sessionId === sessionId);
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
