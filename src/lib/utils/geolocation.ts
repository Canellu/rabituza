import { DrivingDataType, GeoLocation } from '@/types/Activity';

export const calculateTotalRouteDuration = (
  routes: DrivingDataType['routes'] = []
) => {
  return routes.reduce(
    (total, route) => {
      const duration = calculateRouteDuration(route.geolocations);
      const totalSeconds =
        (total.hours || 0) * 3600 +
        total.minutes * 60 +
        total.seconds +
        duration.hours * 3600 +
        duration.minutes * 60 +
        duration.seconds;

      return {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    },
    { hours: 0, minutes: 0, seconds: 0 }
  );
};

export const calculateRouteDuration = (geolocations: GeoLocation[]) => {
  if (geolocations.length < 2) return { hours: 0, minutes: 0, seconds: 0 };

  const firstTimestamp = geolocations[0].timestamp;
  const lastTimestamp = geolocations[geolocations.length - 1].timestamp;
  const durationMs = lastTimestamp - firstTimestamp;

  return {
    hours: Math.floor(durationMs / 1000 / 60 / 60),
    minutes: Math.floor((durationMs / 1000 / 60) % 60),
    seconds: Math.floor((durationMs / 1000) % 60),
  };
};

export const formatDuration = (duration: {
  hours?: number;
  minutes: number;
  seconds: number;
}) => {
  const hours = duration.hours || 0;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (duration.minutes > 0) {
    parts.push(`${duration.minutes}m`);
  }
  if (duration.seconds > 0 || parts.length === 0) {
    parts.push(`${duration.seconds}s`);
  }

  return parts.join(' ');
};

export const getRouteTimeRange = (geolocations: GeoLocation[]) => {
  if (geolocations.length === 0) return { start: null, end: null };

  const firstTimestamp = geolocations[0].timestamp;
  const lastTimestamp = geolocations[geolocations.length - 1].timestamp;

  return {
    start: new Date(firstTimestamp),
    end: new Date(lastTimestamp),
  };
};

export const getRouteTimestamps = (geolocations: GeoLocation[]) => {
  if (geolocations.length < 2) return { start: null, end: null };

  const firstTimestamp = geolocations[0].timestamp;
  const lastTimestamp = geolocations[geolocations.length - 1].timestamp;

  return {
    start: new Date(firstTimestamp),
    end: new Date(lastTimestamp),
  };
};

export const formatTime = (
  date: Date,
  format: 'HH:mm:ss' | 'HH:mm' = 'HH:mm:ss'
) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  switch (format) {
    case 'HH:mm':
      return `${hours}:${minutes}`;
    case 'HH:mm:ss':
    default:
      return `${hours}:${minutes}:${seconds}`;
  }
};
