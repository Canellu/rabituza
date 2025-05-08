import { cn } from '@/lib/utils';
import {
  calculateAccuracyMetrics,
  calculateRouteDuration,
  calculateSpeedMetrics,
  formatDuration,
  getRouteTimestamps,
} from '@/lib/utils/geolocation';
import { formatTime } from '@/lib/utils/time';
import { Route } from '@/types/Activity';
import { Crosshair, Gauge, Hourglass } from 'lucide-react';

interface SavedRoutesListProps {
  routes?: Route[];
}

const SavedRoutesList = ({ routes = [] }: SavedRoutesListProps) => {
  if (routes.length === 0) return null;

  return (
    <div className={cn('max-h-60 overflow-y-auto')}>
      <div className="flex flex-col gap-2">
        {routes.map((route, index) => {
          const duration = calculateRouteDuration(route.geolocations);
          const timestamps = getRouteTimestamps(route.geolocations);
          const { average: avgAccuracy } = calculateAccuracyMetrics(
            route.geolocations
          );
          const { average: avgSpeed } = calculateSpeedMetrics(
            route.geolocations
          );

          return (
            <div
              key={route.id}
              className="flex flex-col border rounded-md text-sm dark:border-stone-700"
            >
              <div className="flex items-center justify-between px-4 py-2">
                <span>Route {index + 1}</span>
                <span>
                  {timestamps.start && timestamps.end ? (
                    <>
                      {formatTime(timestamps.start, 'HH:mm')} -{' '}
                      {formatTime(timestamps.end, 'HH:mm')}
                    </>
                  ) : (
                    'No time data'
                  )}
                </span>
              </div>

              <div>
                <div className="grid grid-cols-3 bg-secondary px-4 py-2 border-t text-stone-700 dark:bg-stone-900 rounded-b-sm dark:border-t-stone-700 dark:text-stone-400">
                  <div className="flex items-center justify-start gap-2">
                    <Crosshair className="size-4" />
                    {avgAccuracy.toFixed(2)}m
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Gauge className="size-4" />
                    {avgSpeed.toFixed(2)}m
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Hourglass className="size-4" />
                    {formatDuration(duration)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedRoutesList;
