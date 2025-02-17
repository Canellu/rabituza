import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import bytesToText from '@/lib/utils/bytesToText';
import { useEffect, useState } from 'react';

interface RecordedSessionListProps {
  locations: Array<{ sessionId: string; timestamp: number }>;
  sessionId: string;
}

const RecordedSessionList = ({
  locations,
  sessionId,
}: RecordedSessionListProps) => {
  const [sortedSessionIds, setSortedSessionIds] = useState<string[]>([]);
  const [locationCountsBySession, setLocationCountsBySession] = useState<
    Record<string, number>
  >({});
  const [dataSizes, setDataSizes] = useState<
    Record<string, { value: string; unit: string }>
  >({});
  const [timestamps, setTimestamps] = useState<
    Record<string, { first: string; last: string }>
  >({});

  useEffect(() => {
    const calculateData = () => {
      const sizes: Record<string, number> = {};
      const sessionTimestamps: Record<string, { first: number; last: number }> =
        {};
      const counts: Record<string, number> = {};

      locations.forEach((location) => {
        const sessionSize = new Blob([JSON.stringify(location)]).size;
        sizes[location.sessionId] =
          (sizes[location.sessionId] || 0) + sessionSize;
        counts[location.sessionId] = (counts[location.sessionId] || 0) + 1;

        if (!sessionTimestamps[location.sessionId]) {
          sessionTimestamps[location.sessionId] = {
            first: location.timestamp,
            last: location.timestamp,
          };
        } else {
          sessionTimestamps[location.sessionId].first = Math.min(
            sessionTimestamps[location.sessionId].first,
            location.timestamp
          );
          sessionTimestamps[location.sessionId].last = Math.max(
            sessionTimestamps[location.sessionId].last,
            location.timestamp
          );
        }
      });

      const formattedSizes = Object.fromEntries(
        Object.entries(sizes).map(([id, size]) => [id, bytesToText(size)])
      );

      const formattedTimestamps = Object.fromEntries(
        Object.entries(sessionTimestamps).map(([id, { first, last }]) => [
          id,
          {
            first: new Date(first).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            last: new Date(last).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
          },
        ])
      );

      const sortedIds = Object.keys(counts).sort((a, b) => {
        const lastA = formattedTimestamps[a]?.last || '';
        const lastB = formattedTimestamps[b]?.last || '';
        return lastB.localeCompare(lastA);
      });

      setSortedSessionIds(sortedIds);
      setLocationCountsBySession(counts);
      setDataSizes(formattedSizes);
      setTimestamps(formattedTimestamps);
    };

    calculateData();
  }, [locations]);

  return (
    <div
      className={cn(
        'bg-white border rounded-md text-sm',
        'max-h-60 overflow-y-auto'
      )}
    >
      {sortedSessionIds.length === 0 ? (
        <div className="p-4 text-center text-stone-700">
          No recorded sessions available.
        </div>
      ) : (
        sortedSessionIds.map((idbSessionId, index) => {
          const count = locationCountsBySession[idbSessionId];
          const isActiveSession = idbSessionId === sessionId;

          return (
            <section
              key={idbSessionId}
              className={cn(
                'grid grid-cols-6',
                index === 0 ? 'border-t-none' : 'border-t'
              )}
            >
              <div className="p-2 col-span-2">
                <span>{idbSessionId.slice(0, 8).toUpperCase()}...</span>
              </div>
              <div className="p-2 text-stone-700 border-x text-center col-span-2">
                {count}
              </div>
              <div className="text-stone-700 text-end p-2 col-span-2">
                {dataSizes[idbSessionId]?.value} {dataSizes[idbSessionId]?.unit}
              </div>
              <Separator className="col-span-6" />
              <div className="bg-secondary col-span-6 grid grid-cols-2 py-2 px-6">
                <div className="text-start text-stone-700">
                  Start: {timestamps[idbSessionId]?.first}
                </div>
                <div className="text-stone-700 text-end">
                  {isActiveSession ? 'Current' : 'End'}:{' '}
                  {timestamps[idbSessionId]?.last}
                </div>
              </div>
              <Separator className="col-span-6" />
            </section>
          );
        })
      )}
    </div>
  );
};

export default RecordedSessionList;
