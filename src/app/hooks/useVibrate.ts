import { useCallback } from "react";

// Custom hook to trigger vibration
const useVibrate = (vibrationPattern: number[]) => {
  const vibrate = useCallback(() => {
    // Check if the Vibration API is supported
    if (navigator.vibrate) {
      // Trigger the vibration pattern
      navigator.vibrate(vibrationPattern);
    } else {
      console.warn("Vibration API is not supported on this device.");
    }
  }, [vibrationPattern]);

  return vibrate;
};

export default useVibrate;
