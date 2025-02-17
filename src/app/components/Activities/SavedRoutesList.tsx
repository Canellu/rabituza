import { cn } from '@/lib/utils';
import {
  calculateRouteDuration,
  formatDuration,
  formatTime,
  getRouteTimestamps,
} from '@/lib/utils/geolocation';
import { Route } from '@/types/Activity';

interface SavedRoutesListProps {
  routes?: Route[];
}

const SavedRoutesList = ({ routes = [] }: SavedRoutesListProps) => {
  if (routes.length === 0) return null;

  return (
    <div
      className={cn(
        'bg-white border rounded-md text-sm',
        'max-h-60 overflow-y-auto'
      )}
    >
      <div className="p-4 flex flex-col divide-y divide-stone-100">
        {routes.map((route) => {
          const duration = calculateRouteDuration(route.geolocations);
          const timestamps = getRouteTimestamps(route.geolocations);

          return (
            <div
              key={route.id}
              className="flex items-center justify-between text-stone-700 py-2 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">{formatDuration(duration)}</span>
                <span className="text-xs">
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
              <span>{formatTime(route.createdAt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedRoutesList;
