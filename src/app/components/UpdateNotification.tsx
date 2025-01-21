import { useServiceWorker } from "../hooks/useServiceWorker";

const UpdateNotification = () => {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  if (!isUpdateAvailable) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0070f3",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: "8px",
        zIndex: 1000,
        cursor: "pointer",
      }}
      onClick={updateServiceWorker}
    >
      New version available. Click to update.
    </div>
  );
};

export default UpdateNotification;
