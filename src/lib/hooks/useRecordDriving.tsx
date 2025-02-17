import {
  estimateDrivingDataSize,
  getAllLocationsFromDB,
} from '@/lib/idb/driving';
import { GeoLocation } from '@/types/Activity';
import { IDBPDatabase, openDB } from 'idb';
import { useEffect, useRef, useState } from 'react';

const DRIVING_DB = 'drivingData';

export const RecordingStates = {
  RECORDING: 'RECORDING',
  IDLING: 'IDLING',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  ERROR: 'ERROR',
} as const;

export type RecordingState =
  (typeof RecordingStates)[keyof typeof RecordingStates];

const useRecordDriving = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingStates.IDLING
  );
  const [locations, setLocations] = useState<GeoLocation[]>([]);
  const [dataSize, setDataSize] = useState<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const dbRef = useRef<IDBPDatabase | null>(null);

  // Update data size whenever locations change
  useEffect(() => {
    const updateDataSize = async () => {
      const size = await estimateDrivingDataSize();
      setDataSize(size);
    };
    updateDataSize();
  }, [locations]);

  // On mount: Initialize IndexedDB and load locations
  // On unmount: Clear geolocation watch and close DB connection
  useEffect(() => {
    const initDBAndLoadLocations = async () => {
      try {
        // Test for IndexedDB availability and private browsing mode
        const testRequest = indexedDB.open('test');
        testRequest.onerror = () => {
          console.error(
            'IndexedDB is not available (possibly private browsing mode)'
          );
          setRecordingState(RecordingStates.ERROR);
        };

        // Initialize DB with error handling
        dbRef.current = await openDB(DRIVING_DB, 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('locations')) {
              db.createObjectStore('locations', {
                keyPath: 'timestamp',
              });
            }
          },
          blocked() {
            console.error('Database blocked - another version is open');
          },
          blocking() {
            console.error(
              'Database blocking - newer version attempting to open'
            );
          },
          terminated() {
            console.error('Database terminated unexpectedly');
          },
        });

        // Load locations
        const allLocations = await getAllLocationsFromDB();
        setLocations(allLocations);
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        setRecordingState(RecordingStates.ERROR);
      }
    };

    initDBAndLoadLocations();

    // Cleanup function
    return () => {
      if (dbRef.current) {
        dbRef.current.close();
        dbRef.current = null;
      }
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
    if (!dbRef.current) {
      dbRef.current = await openDB(DRIVING_DB, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('locations')) {
            db.createObjectStore('locations', {
              keyPath: 'timestamp',
            });
          }
        },
      });
    }
    return dbRef.current;
  };

  const startRecording = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    try {
      const db = await getDB();

      // Test storage availability
      try {
        const testData = { test: 'data' };
        const tx = db.transaction('locations', 'readwrite');
        await tx.objectStore('locations').add({
          ...testData,
          timestamp: Date.now(),
        });
        await tx.done;
      } catch (error) {
        console.error('Storage test failed:', error);
        alert(
          'Unable to store data. You might be in private browsing mode or out of storage space.'
        );
        setRecordingState(RecordingStates.ERROR);
        return;
      }

      if (recordingState === RecordingStates.PAUSED) {
        // Verify all locations are synced before resuming
        const tx = db.transaction('locations', 'readwrite');
        const store = tx.objectStore('locations');
        const dbLocations = await store.getAll();

        // Verify local state matches DB state
        const syncMismatch = locations.length !== dbLocations.length;
        if (syncMismatch) {
          setLocations(dbLocations); // Sync local state with DB
          console.log('Synced local state with DB before resuming');
        }

        await tx.done;
      }

      // Start watching position before updating state
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };

          try {
            // Start new transaction
            const tx = db.transaction('locations', 'readwrite');
            const store = tx.objectStore('locations');
            await store.put(newLocation);
            await tx.done;

            // Update locations state, handling potential duplicate timestamps
            // If a location with the same timestamp exists, update it
            // Otherwise, append the new location to the array
            setLocations((prevLocations) => {
              const index = prevLocations.findIndex(
                (loc) => loc.timestamp === newLocation.timestamp
              );

              if (index !== -1) {
                const newLocations = [...prevLocations];
                newLocations[index] = newLocation;
                return newLocations;
              }
              return [...prevLocations, newLocation];
            });
          } catch (error) {
            console.error('Error saving location to IndexedDB:', error);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
          setRecordingState(RecordingStates.STOPPED);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );

      setRecordingState(RecordingStates.RECORDING);
      console.log(
        recordingState === RecordingStates.PAUSED
          ? 'Resumed recording'
          : 'Started recording'
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingState(RecordingStates.ERROR);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording');
    clearNavigator();
    setRecordingState(RecordingStates.STOPPED);
  };

  const pauseRecording = async () => {
    console.log('Pausing recording');
    clearNavigator();
    setRecordingState(RecordingStates.PAUSED);
  };

  const resetRecording = async () => {
    clearNavigator();

    try {
      const db = await getDB();
      const tx = db.transaction('locations', 'readwrite');
      const store = tx.objectStore('locations');
      const allLocations = await store.getAll();

      // Delete locations
      for (const location of allLocations) {
        await store.delete(location.timestamp);
      }

      await tx.done;
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
    setLocations([]);
    setRecordingState(RecordingStates.IDLING);
  };

  return {
    recordingState,
    locations,
    dataSize,
    setLocations,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    setRecordingState,
  };
};

export default useRecordDriving;
