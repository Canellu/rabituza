import {
  clearAllLocations,
  estimateDrivingDataSize,
  getDBConnection,
} from '@/lib/idb/driving';
import { GeoLocation } from '@/types/Activity';
import { useRef, useState } from 'react';
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

const MIN_INTERVAL_MS = 1000; // Minimum interval of 1 seconds, dont record datapoints any faster

const useRecordDriving = () => {
  const [locations, setLocations] = useState<GeoLocation[]>([]);
  const [dataSize, setDataSize] = useState<number>(0);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isStartingRecording, setIsStartingRecording] =
    useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt');
  const [recordingState, setRecordingState] = useState<RecordingState>(
    RecordingStates.IDLING
  );
  const [minInterval, setMinInterval] = useState<number>(MIN_INTERVAL_MS);
  const [isIntervalEnabled, setIsIntervalEnabled] = useState<
    boolean | undefined
  >(true);
  const watchIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const resetRecording = async () => {
    setIsResetting(true);
    clearNavigator();

    try {
      await clearAllLocations();
      setLocations([]);
      setRecordingState(RecordingStates.IDLING);
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      toast.error('Error clearing IndexedDB');
    } finally {
      setIsResetting(false);
    }
  };
  const clearNavigator = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };
  const updateDataSize = async () => {
    try {
      const size = await estimateDrivingDataSize();
      setDataSize(size);
    } catch (error) {
      console.error('Failed to estimate storage size:', error);
      toast.error('Failed to estimate storage size');
    }
  };
  const startRecording = async () => {
    setIsStartingRecording(true);
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      setIsStartingRecording(false);
      return;
    }
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        });
        setPermissionStatus(permission.state);
        if (permission.state === 'denied') {
          toast.error(
            'Location access is blocked. Please enable it in your Browser settings',
            {
              description: 'Settings > Browser > Location',
              duration: 5000,
            }
          );
          setIsStartingRecording(false);
          return;
        }
      }
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setPermissionStatus('granted');
            resolve(true);
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setPermissionStatus('denied');
              toast.error(
                'Location permission denied. Please allow location access to record routes.'
              );
            }
            reject(error);
          },
          { enableHighAccuracy: true }
        );
      });
    } catch (error) {
      console.error('Permission error:', error);
      setIsStartingRecording(false);
      return; // Exit early if permission denied
    }
    // Continue with recording if permission granted
    try {
      const db = await getDBConnection();
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
          setIsStartingRecording(false);
          return;
        }
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const newLocation: GeoLocation = {
            latitude: parseFloat(position.coords.latitude.toFixed(4)),
            longitude: parseFloat(position.coords.longitude.toFixed(4)),
            timestamp: position.timestamp,
            accuracy: Math.round(position.coords.accuracy),
            speed: position.coords.speed,
          };
          // Skip points with very poor accuracy (over 100 meters)
          if (position.coords.accuracy > 100) {
            console.log(
              'Skipping low accuracy position:',
              position.coords.accuracy
            );
            return;
          }
          // Check if the new location is within the minimum interval
          if (
            isIntervalEnabled &&
            lastTimestampRef.current &&
            newLocation.timestamp - lastTimestampRef.current < minInterval
          ) {
            console.log('Skipping location due to minimum interval');
            return;
          }
          lastTimestampRef.current = newLocation.timestamp;
          try {
            const tx = db.transaction('locations', 'readwrite');
            const store = tx.objectStore('locations');
            await store.put(newLocation);
            await tx.done;
            updateDataSize();
            setLocations((prevLocations) => {
              const exists = prevLocations.some(
                (loc) => loc.timestamp === newLocation.timestamp
              );
              if (!exists) {
                return [...prevLocations, newLocation];
              }
              return prevLocations;
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
              errorMessage += 'Signal lost - this is normal in tunnels';
              // Don't change recording state, just notify
              toast.info('GPS signal weak or lost - this is normal in tunnels');
              return;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out';
              // Notify user about the timeout but don't set to ERROR
              toast.info('GPS signal weak or lost - attempting to reconnect');
              return;
            default:
              errorMessage += error.message;
          }
          console.error('Geolocation error:', {
            code: error.code,
            message: error.message,
            fullError: error,
          });
          // Only show error toast for non-signal loss issues
          if (
            error.code !== error.POSITION_UNAVAILABLE &&
            error.code !== error.TIMEOUT
          ) {
            toast.error(errorMessage);
            setRecordingState(RecordingStates.ERROR);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
        }
      );
      setRecordingState(RecordingStates.RECORDING);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
      setRecordingState(RecordingStates.ERROR);
    } finally {
      setIsStartingRecording(false);
    }
  };
  const pauseRecording = async () => {
    console.log('Pausing recording');
    clearNavigator();
    setRecordingState(RecordingStates.PAUSED);
  };
  const stopRecording = () => {
    console.log('Stopping recording');
    clearNavigator();
    setRecordingState(RecordingStates.STOPPED);
  };
  // Add these calculations
  const currentSpeed =
    locations.length > 0 ? locations[locations.length - 1].speed || 0 : 0;
  const currentAccuracy =
    locations.length > 0 ? locations[locations.length - 1].accuracy : 0;
  return {
    recordingState,
    locations,
    dataSize,
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    isResetting,
    isStartingRecording,
    permissionStatus,
    minInterval,
    setMinInterval,
    isIntervalEnabled,
    setIsIntervalEnabled,
    currentSpeed,
    currentAccuracy,
  };
};

export default useRecordDriving;
