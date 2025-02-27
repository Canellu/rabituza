'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getMapLoadCount } from '@/lib/database/map/getMapLoadCount';
import { incrementMapLoadCount } from '@/lib/database/map/incrementMapLoadCount';
import { BaseActivityType, DrivingDataType } from '@/types/Activity';
import { MapPinOff } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Spinner from '../Spinner';
import RouteStatistics from './RouteStatistics';

const MAX_MAP_LOADS = 50000;
interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  activity: BaseActivityType & DrivingDataType;
}

const MapDialog = ({ open, onClose, activity }: MapDialogProps) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isDialogReady, setIsDialogReady] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0); //  -1 Represent "All routes"
  const [isSmoothing, setIsSmoothing] = useState(true);
  const [mapLoadError, setMapLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const sortedRoutes = activity.routes?.slice().sort((a, b) => {
    const aLastTimestamp =
      a.geolocations[a.geolocations.length - 1]?.timestamp ?? 0;
    const bLastTimestamp =
      b.geolocations[b.geolocations.length - 1]?.timestamp ?? 0;
    return aLastTimestamp - bLastTimestamp;
  });

  // Handle route updates
  const updateMapRoutes = useCallback(
    (routeIndex: number) => {
      const map = mapRef.current;
      if (!map || !sortedRoutes?.length) return;

      // Remove existing sources and layers
      sortedRoutes.forEach(({ id }) => {
        const routeId = `route-${id}`;
        if (map.getLayer(routeId)) map.removeLayer(routeId);
        if (map.getLayer(`${routeId}-arrows`))
          map.removeLayer(`${routeId}-arrows`);
        if (map.getSource(routeId)) map.removeSource(routeId);
      });

      // Remove existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].remove();
      }

      const allCoordinates = sortedRoutes
        .filter((_, index) => routeIndex === -1 || routeIndex === index)
        .filter((route) => route.geolocations.length > 0) // Filter out routes with no geolocations
        .map((route) => ({
          id: route.id,
          coordinates: route.geolocations
            .filter((_, index) => index % (isSmoothing ? 3 : 1) === 0)
            .map((geo) => [geo.longitude, geo.latitude]),
        }));

      if (allCoordinates.length === 0) return; // Exit if no valid coordinates

      // Calculate new bounds
      const bounds = allCoordinates.reduce((totalBounds, { coordinates }) => {
        if (coordinates.length === 0) return totalBounds; // Skip empty coordinates
        coordinates.forEach((coord) => {
          totalBounds.extend(coord as [number, number]);
        });
        return totalBounds;
      }, new mapboxgl.LngLatBounds(allCoordinates[0].coordinates[0] as [number, number], allCoordinates[0].coordinates[0] as [number, number]));

      // Add new sources and layers
      allCoordinates.forEach(({ id, coordinates }, index) => {
        if (coordinates.length === 0) return; // Skip routes with no coordinates
        const routeId = `route-${id}`;

        map.addSource(routeId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
            properties: {},
          },
        });

        map.addLayer({
          id: routeId,
          type: 'line',
          source: routeId,
          paint: {
            'line-color': '#737373',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });

        map.addLayer({
          id: `${routeId}-arrows`,
          type: 'symbol',
          source: routeId,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 100,
            'icon-image': 'arrow',
            'icon-size': 0.7,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });

        // Add markers
        new mapboxgl.Marker({ color: '#4ade80' })
          .setLngLat(coordinates[0] as [number, number])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: 'custom-popup',
            }).setText(`Route ${index + 1} Start`)
          )
          .addTo(map);

        new mapboxgl.Marker({ color: '#fb923c' })
          .setLngLat(coordinates[coordinates.length - 1] as [number, number])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: 'custom-popup',
            }).setText(`Route ${index + 1} End`)
          )
          .addTo(map);
      });

      // Update map bounds
      map.fitBounds(bounds, { padding: 50 });
    },
    [isSmoothing, sortedRoutes]
  );

  // Handle dialog ready state, necessary because map wont load otherwise
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsDialogReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsDialogReady(false);
    }
  }, [open]);

  // Load the map
  useEffect(() => {
    const initializeMap = async () => {
      if (
        !isDialogReady ||
        !mapContainerRef.current ||
        mapRef.current ||
        !sortedRoutes?.length
      ) {
        return;
      }

      try {
        const count = await getMapLoadCount();
        if (count >= MAX_MAP_LOADS - 1000) {
          setMapLoadError('Map load limit reached\n Contact Anton');
          return;
        }

        await incrementMapLoadCount();
        setMapLoadError(null);

        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
        mapboxgl.accessToken = accessToken;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [10.7522, 59.9139],
          zoom: 10,
        });

        map.addControl(new mapboxgl.NavigationControl());

        map.on('load', () => {
          map.loadImage('/icons/chevron-right.png', (error, image) => {
            if (error) throw error;
            if (!map.hasImage('arrow') && image) {
              map.addImage('arrow', image);
            }
          });

          setIsMapLoaded(true);
        });

        mapRef.current = map;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isDialogReady, sortedRoutes?.length]);

  // Update routes when selectedRouteIndex changes
  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      updateMapRoutes(selectedRouteIndex);
    }
  }, [selectedRouteIndex, updateMapRoutes, isMapLoaded]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
        <DialogHeader>
          <DialogTitle>Routes</DialogTitle>
          <DialogDescription className="sr-only">
            View and manage your recorded routes on the map
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {sortedRoutes && sortedRoutes.length > 0 ? (
            <>
              <div className="space-y-4">
                <Select
                  value={selectedRouteIndex.toString()}
                  onValueChange={(value) => {
                    const newIndex = Number(value);
                    setSelectedRouteIndex(newIndex);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">All Routes</SelectItem>
                    {sortedRoutes.map((route, index) => (
                      <SelectItem key={route.id} value={index.toString()}>
                        Route {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mapLoadError || isLoading ? (
                <div className="w-full h-[350px] rounded-md border flex flex-col gap-4 items-center justify-center p-4 relative isolate overflow-hidden">
                  {mapLoadError && (
                    <>
                      <MapPinOff className="text-stone-600" />
                      <span className="text-stone-600 font-medium text-center text-sm whitespace-pre-line">
                        {mapLoadError}
                      </span>
                      <MapPinOff className="text-stone-400/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 -z-10" />
                    </>
                  )}

                  {isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Spinner size="size-6" />
                      <span className="text-sm text-stone-600">
                        Loading map...
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  ref={mapContainerRef}
                  className="w-full h-[350px] rounded-md border"
                />
              )}

              <div className="flex items-center justify-between border rounded-md p-2 bg-stone-50">
                <Label className="text-sm">Route Smoothing</Label>
                <Switch
                  checked={isSmoothing}
                  onCheckedChange={(checked) => {
                    setIsSmoothing(checked);
                  }}
                />
              </div>
              <RouteStatistics
                routes={
                  selectedRouteIndex === -1
                    ? sortedRoutes
                    : [sortedRoutes[selectedRouteIndex]]
                }
              />
            </>
          ) : (
            <p>No routes available to display on the map.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
