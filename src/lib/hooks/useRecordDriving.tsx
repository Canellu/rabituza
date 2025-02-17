import {
  estimateDrivingDataSize,
  getAllLocationsFromDB,
  initDB,
} from '@/lib/idb/driving';
import { GeoLocation } from '@/types/Activity';
import { IDBPDatabase } from 'idb';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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
      try {
        const size = await estimateDrivingDataSize();
        setDataSize(size);
      } catch (error) {
        console.error('Failed to estimate data size:', error);
        toast.error('Failed to calculate storage size');
      }
    };
    updateDataSize();
  }, [locations]);

  // On mount: Initialize IndexedDB and load locations
  // On unmount: Clear geolocation watch and close DB connection
  // Initialize IndexedDB and load locations
  useEffect(() => {
    const initDBAndLoadLocations = async () => {
      try {
        dbRef.current = await initDB();
        const allLocations = await getAllLocationsFromDB();
        setLocations(allLocations);
        toast.success(`Successfully initialized storage`);
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
        toast.error('Failed to initialize storage');
        setRecordingState(RecordingStates.ERROR);
      }
    };

    initDBAndLoadLocations();

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
      try {
        dbRef.current = await initDB();
      } catch (error) {
        console.error('Failed to get DB connection:', error);
        toast.error('Failed to connect to storage');
        throw error;
      }
    }
    return dbRef.current;
  };

  const startRecording = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    // Request permission first
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              toast.error('Location permission denied. Please allow location access to record routes.');
            }
            reject(error);
          },
          { enableHighAccuracy: true }
        );
      });
    } catch (error) {
      console.error('Permission error:', error);
      return; // Exit early if permission denied
    }

    // Continue with recording if permission granted
    try {
      const db = await getDB();

      if (recordingState === RecordingStates.PAUSED) {
        try {
          const tx = db.transaction('locations', 'readwrite');
          const store = tx.objectStore('locations');
          const dbLocations = await store.getAll();

          if (locations.length !== dbLocations.length) {
            setLocations(dbLocations);
            toast.info('Synced locations with storage');
          }
          await tx.done;
        } catch (error) {
          console.error('Failed to sync locations:', error);
          toast.error('Failed to sync locations');
          return;
        }
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation: GeoLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };

          try {
            const tx = db.transaction('locations', 'readwrite');
            const store = tx.objectStore('locations');
            await store.put(newLocation);
            await tx.done;

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
            console.error('Failed to save location:', error);
            toast.error('Failed to save location');
          }
        },
        (error) => {
          // Enhanced error handling for geolocation errors
          let errorMessage = 'Failed to track location: ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out';
              break;
            default:
              errorMessage += error.message;
          }
          console.error('Geolocation error:', {
            code: error.code,
            message: error.message,
            fullError: error,
          });
          toast.error(errorMessage);
          setRecordingState(RecordingStates.ERROR);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Increased timeout
          maximumAge: 0, // Get fresh positions
        }
      );

      setRecordingState(RecordingStates.RECORDING);
      toast.success(
        recordingState === RecordingStates.PAUSED
          ? 'Resumed recording'
          : 'Started recording'
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
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
