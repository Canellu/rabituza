import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';

const DRIVING_DB = 'drivingData';

export const countDrivingDataEntries = async (): Promise<number> => {
  const db = await openDB(DRIVING_DB, 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const count = await store.count();
  return count;
};

export const estimateDrivingDataSize = async (): Promise<number> => {
  const db = await openDB(DRIVING_DB, 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  const sizeInBytes = locations.reduce((total, location) => {
    return total + new Blob([JSON.stringify(location)]).size;
  }, 0);
  return sizeInBytes;
};

// Retrieve all locations from IndexedDB
export const getAllLocationsFromDB = async (): Promise<GeoLocation[]> => {
  const db = await openDB(DRIVING_DB, 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  return locations;
};

export const getLocationsBySessionId = async (sessionId: string): Promise<GeoLocation[]> => {
  const db = await openDB(DRIVING_DB, 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const allLocations = await store.getAll();
  return allLocations.filter(location => location.sessionId === sessionId);
};

export const deleteEntriesByDate = async (date: string): Promise<void> => {
  const db = await openDB('drivingData', 1);
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
