import { GeoLocation } from '@/types/Activity';
import { openDB } from 'idb';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const DRIVING_DB = 'drivingData';

export const RecordingStates = {
  NOT_STARTED: 'NOT_STARTED',
  RECORDING: 'RECORDING',
  IDLING: 'IDLING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
} as const;

export type RecordingState =
  (typeof RecordingStates)[keyof typeof RecordingStates];

import { getAllLocationsFromDB } from '@/lib/idb/driving'; // Import the function

const useRecordDriving = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingStates.NOT_STARTED
  );
  const [locations, setLocations] = useState<GeoLocation[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      const allLocations = await getAllLocationsFromDB();
      setLocations(allLocations);
      console.log(allLocations);
    };

    loadLocations();

    // Cleanup function to clear geolocation watch on unmount
    return () => {
      clearNavigator();
    };
  }, []);

  const clearNavigator = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const getDB = async () => {
    try {
      return openDB(DRIVING_DB, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('locations')) {
            // Use a composite key of timestamp and sessionId
            db.createObjectStore('locations', {
              keyPath: ['timestamp', 'sessionId'],
            });
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

    let currentSessionId = sessionId;

    if (recordingState === RecordingStates.PAUSED) {
      setRecordingState(RecordingStates.RECORDING);
      console.log('Resumed recording');
    } else {
      currentSessionId = uuidv4();
      setSessionId(currentSessionId);
      setRecordingState(RecordingStates.RECORDING);
      console.log('Started recording');
    }

    const db = await getDB();
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        if (currentSessionId) {
          const newLocation: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            sessionId: currentSessionId,
          };

          // Update local state
          setLocations((prevLocations) => [...prevLocations, newLocation]);

          // Add to IndexedDB using the composite key
          const tx = db.transaction('locations', 'readwrite');
          await tx.store.put(newLocation);
        } else {
          console.error('Session ID is null, cannot log location');
        }
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return;
  };

  const stopRecording = () => {
    console.log('Stopping recording');
    clearNavigator();
    setRecordingState(RecordingStates.STOPPED);
  };

  const pauseRecording = () => {
    console.log('Pausing recording');
    clearNavigator();
    setRecordingState(RecordingStates.PAUSED);
  };

  const resetRecording = async () => {
    clearNavigator();
    setRecordingState(RecordingStates.IDLING);
    if (!sessionId) {
      console.error('Session ID is null, cannot clear locations');
      return;
    }
    try {
      const db = await getDB();
      const tx = db.transaction('locations', 'readwrite');
      const store = tx.objectStore('locations');
      const allLocations = await store.getAll();
  
      // Filter and delete locations with the current session ID
      for (const location of allLocations) {
        if (location.sessionId === sessionId) {
          await store.delete([location.timestamp, location.sessionId]); // Use composite key
        }
      }
  
      // Update local state to remove locations with the current session ID
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.sessionId !== sessionId)
      );
  
      await tx.done;
      console.log(`Cleared locations for session ID: ${sessionId}`);
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  };

  return {
    recordingState,
    locations,
    setLocations,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    setRecordingState,
    sessionId,
  };
};

export default useRecordDriving;
