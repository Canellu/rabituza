import { DrivingDataType, GeoLocation, Route } from '@/types/Activity';

export const calculateSpeedMetrics = (geolocations: GeoLocation[]) => {
  const speeds = geolocations
    .map((loc) => (loc.speed || 0) * 3.6) // Convert m/s to km/h
    .sort((a, b) => a - b);
  const totalSpeed = speeds.reduce((total, speed) => total + speed, 0);
  const mid = Math.floor(speeds.length / 2);

  return {
    max: speeds[speeds.length - 1] || 0,
    min: speeds[0] || 0,
    average: totalSpeed / speeds.length,
    median:
      speeds.length % 2 !== 0
        ? speeds[mid]
        : (speeds[mid - 1] + speeds[mid]) / 2,
  };
};

export const calculateAccuracyMetrics = (geolocations: GeoLocation[]) => {
  const accuracies = geolocations
    .map((loc) => loc.accuracy)
    .sort((a, b) => a - b);
  const totalAccuracy = accuracies.reduce(
    (total, accuracy) => total + accuracy,
    0
  );
  const mid = Math.floor(accuracies.length / 2);

  return {
    max: accuracies[accuracies.length - 1] || 0,
    min: accuracies[0] || 0,
    average: totalAccuracy / accuracies.length,
    median:
      accuracies.length % 2 !== 0
        ? accuracies[mid]
        : (accuracies[mid - 1] + accuracies[mid]) / 2,
  };
};

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

export const generateGeoJSON = (routes: Route[]) => {
  return routes.map((route) => ({
    type: 'Feature',
    properties: {
      id: route.id,
      createdAt: route.createdAt,
    },
    geometry: {
      type: 'LineString',
      coordinates: route.geolocations.map((geo) => [
        geo.longitude,
        geo.latitude,
      ]),
    },
  }));
};

export const encodeRouteToPolyline = (route: Route): string => {
  let lastLat = 0;
  let lastLng = 0;
  let result = '';

  route.geolocations.forEach(({ latitude, longitude }) => {
    const latE5 = Math.round(latitude * 1e5);
    const lngE5 = Math.round(longitude * 1e5);

    const dLat = latE5 - lastLat;
    const dLng = lngE5 - lastLng;

    lastLat = latE5;
    lastLng = lngE5;

    result += encodeSignedNumber(dLat) + encodeSignedNumber(dLng);
  });

  return result;
};

const encodeSignedNumber = (num: number): string => {
  let sgnNum = num << 1;
  if (num < 0) {
    sgnNum = ~sgnNum;
  }
  return encodeNumber(sgnNum);
};

const encodeNumber = (num: number): string => {
  let encoded = '';
  while (num >= 0x20) {
    encoded += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
    num >>= 5;
  }
  encoded += String.fromCharCode(num + 63);
  return encoded;
};


// Helper to calculate distance between two lat/lng points using the Haversine formula
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // meters
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate total distance for all routes
export function calculateTotalDistance(routes: Route[]): number {
  let totalDistance = 0;
  routes.forEach((route) => {
    const geolocations = route.geolocations;
    for (let i = 1; i < geolocations.length; i++) {
      const prev = geolocations[i - 1];
      const curr = geolocations[i];
      totalDistance += haversineDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
    }
  });
  return totalDistance;
}
