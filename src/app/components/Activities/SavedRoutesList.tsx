import { Button } from '@/components/ui/button';
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
import { Crosshair, Gauge, Hourglass, Trash2 } from 'lucide-react';
import * as ResizablePanel from '../ResizablePanel';

interface SavedRoutesListProps {
  routes?: Route[];
  onDeleteRoute?: (routeId: string) => void;
}

const SavedRoutesList = ({
  routes = [],
  onDeleteRoute,
}: SavedRoutesListProps) => {
  if (routes.length === 0) return null;

  return (
    <div className={cn('max-h-60 overflow-y-auto')}>
      <ResizablePanel.Root value="routes">
        <ResizablePanel.Content value="routes">
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
                  className="flex flex-col border rounded-md text-sm dark:border-transparent overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2 dark:bg-stone-900 bg-white">
                    <span>Route {index + 1}</span>
                    <div className="flex items-center gap-2">
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
                      {onDeleteRoute && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 text-red-500 hover:text-red-600 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            const button = e.currentTarget;
                            button.classList.add('scale-90');
                            setTimeout(() => {
                              onDeleteRoute(route.id);
                            }, 150);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 bg-secondary px-4 py-2 border-t text-stone-700 dark:bg-stone-950 rounded-b-sm dark:border-t-stone-700 dark:text-stone-100">
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
              );
            })}
          </div>
        </ResizablePanel.Content>
      </ResizablePanel.Root>
    </div>
  );
};

export default SavedRoutesList;
