import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';
import { useRef, useState } from 'react';

const DRIVING_DB = 'drivingData';

const useRecordDriving = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [locations, setLocations] = useState<GeoLocation[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const getDB = async () => {
    try {
      return openDB(DRIVING_DB, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('locations')) {
            db.createObjectStore('locations', { keyPath: 'timestamp' });
          }
        },
      });
    } catch (error) {
      console.error('Error opening IndexedDB:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsRecording(true);
    setIsPaused(false);

    // Start watching the user's position
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        if (isPaused) return; // Skip if paused

        const { latitude, longitude } = position.coords;
        const timestamp = new Date();
        const newLocation: GeoLocation = { latitude, longitude, timestamp };

        // Save the new location to state and IndexedDB
        setLocations((prev) => [...prev, newLocation]);

        try {
          const db = await getDB();
          const tx = db.transaction('locations', 'readwrite');
          await tx.store.put(newLocation);
        } catch (error) {
          console.error('Error saving location to IndexedDB:', error);
        }
      },
      (error) => console.error('GPS error:', error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  };

  const pauseRecording = () => {
    setIsPaused(true);
  };

  const resumeRecording = () => {
    setIsPaused(false);
  };

  const stopRecording = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const resetRecording = async () => {
    stopRecording();
    setLocations([]);
    try {
      const db = await getDB();
      const tx = db.transaction('locations', 'readwrite');
      await tx.store.clear();
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  };

  return {
    isRecording,
    isPaused,
    locations,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  };
};

export default useRecordDriving;
