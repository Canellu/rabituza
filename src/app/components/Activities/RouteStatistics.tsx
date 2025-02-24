import bytesToText from '@/lib/utils/bytesToText';
import {
  calculateAccuracyMetrics,
  calculateSpeedMetrics,
  formatDuration,
} from '@/lib/utils/geolocation';
import { Route } from '@/types/Activity';

interface RouteStatisticsProps {
  route: Route;
}

const RouteStatistics = ({ route }: RouteStatisticsProps) => {
  const calculateRouteStats = (route: Route) => {
    const {
      max: maxSpeed,
      average: avgSpeed,
    } = calculateSpeedMetrics(route.geolocations);
    const { average: avgAccuracy } = calculateAccuracyMetrics(route.geolocations);
    const dataSize = new TextEncoder().encode(JSON.stringify(route)).length;
    const { value: dataAmount, unit: dataUnit } = bytesToText(dataSize);

    const start = route.geolocations[0].timestamp;
    const end = route.geolocations[route.geolocations.length - 1].timestamp;
    const durationMs = end - start;
    const duration = formatDuration({
      hours: Math.floor(durationMs / (1000 * 60 * 60)),
      minutes: Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((durationMs % (1000 * 60)) / 1000),
    });

    // Format timestamps
    const startTime = new Date(start).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const endTime = new Date(end).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return {
      maxSpeed: maxSpeed.toFixed(1),
      avgSpeed: avgSpeed.toFixed(1),
      avgAccuracy: avgAccuracy.toFixed(1),
      dataSize: `${dataAmount} ${dataUnit}`,
      duration,
      startTime,
      endTime,
    };
  };

  const stats = calculateRouteStats(route);

  const statItems = [
    { label: 'Start Time', value: stats.startTime },
    { label: 'End Time', value: stats.endTime },
    { label: 'Total Duration', value: stats.duration },
    { label: 'Maximum Speed', value: `${stats.maxSpeed} km/h` },
    { label: 'Average Speed', value: `${stats.avgSpeed} km/h` },
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
