"use client";

import { useEffect } from "react";

const DisableBackButton: React.FC = () => {
  useEffect(() => {
    // Push a dummy state to history when the page loads
    window.history.pushState(null, "", window.location.href);

    // Event listener for back navigation
    const popstateHandler = () => {
      // Keep pushing the current URL to prevent the user from going back
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", popstateHandler);

    // Optional: Handle page unload (when user tries to close or navigate away)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Modern browsers only allow returning a boolean value
      event.preventDefault(); // Required for modern browsers
      return true; // Allow the unload
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup listeners when the component is unmounted
    return () => {
      window.removeEventListener("popstate", popstateHandler);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // No need to render anything in this component
};

export default DisableBackButton;
