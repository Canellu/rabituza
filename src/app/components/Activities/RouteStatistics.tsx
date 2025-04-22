import bytesToText from '@/lib/utils/bytesToText';
import {
  calculateAccuracyMetrics,
  calculateSpeedMetrics,
  formatDuration,
  haversineDistance,
} from '@/lib/utils/geolocation';
import { Route } from '@/types/Activity';

interface RouteStatisticsProps {
  routes: Route[];
}

const RouteStatistics = ({ routes }: RouteStatisticsProps) => {
  const calculateRouteStats = (routes: Route[]) => {
    let totalMaxSpeed = 0;
    let totalAvgSpeed = 0;
    let totalAvgAccuracy = 0;
    let totalDataSize = 0;
    let totalDurationMs = 0;
    let startTime = Infinity;
    let endTime = 0;
    let totalDistance = 0;

    routes.forEach((route) => {
      const { max: maxSpeed, average: avgSpeed } = calculateSpeedMetrics(
        route.geolocations
      );
      const { average: avgAccuracy } = calculateAccuracyMetrics(
        route.geolocations
      );
      const dataSize = new TextEncoder().encode(JSON.stringify(route)).length;
      totalMaxSpeed = Math.max(totalMaxSpeed, maxSpeed);
      totalAvgSpeed += avgSpeed;
      totalAvgAccuracy += avgAccuracy;
      totalDataSize += dataSize;

      const geos = route.geolocations;
      for (let i = 1; i < geos.length; i++) {
        totalDistance +=
          haversineDistance(
            geos[i - 1].latitude,
            geos[i - 1].longitude,
            geos[i].latitude,
            geos[i].longitude
          ) / 1000; // convert meters to kilometers
      }

      const start = geos[0]?.timestamp ?? 0;
      const end = geos[geos.length - 1]?.timestamp ?? 0;

      if (start && end) {
        totalDurationMs += end - start;
        startTime = Math.min(startTime, start);
        endTime = Math.max(endTime, end);
      }
    });

    const avgSpeed = totalAvgSpeed / routes.length;
    const avgAccuracy = totalAvgAccuracy / routes.length;
    const { value: dataAmount, unit: dataUnit } = bytesToText(totalDataSize);

    const duration = formatDuration({
      hours: Math.floor(totalDurationMs / (1000 * 60 * 60)),
      minutes: Math.floor((totalDurationMs % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((totalDurationMs % (1000 * 60)) / 1000),
    });

    // Format timestamps
    const formattedStartTime = new Date(startTime).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const formattedEndTime = new Date(endTime).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return {
      maxSpeed: Math.round(totalMaxSpeed).toString(),
      avgSpeed: Math.round(avgSpeed).toString(),
      avgAccuracy: avgAccuracy.toFixed(1),
      dataSize: `${dataAmount} ${dataUnit}`,
      duration,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      totalDistance: totalDistance.toFixed(2), // in km
    };
  };

  const stats = calculateRouteStats(routes);

  const statItems = [
    { label: 'Start Time', value: stats.startTime },
    { label: 'End Time', value: stats.endTime },
    { label: 'Duration', value: stats.duration },
    { label: 'Distance', value: `${stats.totalDistance} km` },
    { label: 'Average Speed', value: `${stats.avgSpeed} km/h` },
    { label: 'Maximum Speed', value: `${stats.maxSpeed} km/h` },
    { label: 'Average Accuracy', value: `${stats.avgAccuracy} meters` },
    { label: 'Route Data Size', value: stats.dataSize },
  ];

  return (
    <div className="bg-stone-50 p-4 rounded-lg space-y-2 border">
      <h3 className="font-semibold text-sm">Route Statistics</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {statItems.map((item) => (
          <div key={item.label}>
            <p className="text-stone-500">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteStatistics;
