import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';

const DRIVING_DB = 'drivingData';

// Retrieve all locations from IndexedDB
export const getAllLocationsFromDB = async (): Promise<GeoLocation[]> => {
  const db = await openDB(DRIVING_DB, 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  const locations = await store.getAll();
  return locations;
};
