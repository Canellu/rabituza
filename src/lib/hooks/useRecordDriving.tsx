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

    if (isPaused) {
      // Resuming recording
      setIsPaused(false);
      console.log('Resumed recording');
    } else {
      // Starting new recording
      setIsRecording(true);
      console.log('Started recording');
    }

    return;
  };

  const pauseRecording = () => {
    console.log('Pausing recording');
    setIsPaused(true);
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
    stopRecording,
    resetRecording,
  };
};

export default useRecordDriving;
