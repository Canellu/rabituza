'use client';

import {
  Dialog,
  DialogContent,
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
import { BaseActivityType, DrivingDataType } from '@/types/Activity';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import RouteStatistics from './RouteStatistics';

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  activity: BaseActivityType & DrivingDataType;
}

const MapDialog = ({ open, onClose, activity }: MapDialogProps) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isDialogReady, setIsDialogReady] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isSmoothing, setIsSmoothing] = useState(true);

  // Handle dialog ready state
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsDialogReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsDialogReady(false);
    }
  }, [open]);
  const sortedRoutes = activity.routes?.slice().sort((a, b) => {
    const aLastTimestamp = a.geolocations[a.geolocations.length - 1].timestamp;
    const bLastTimestamp = b.geolocations[b.geolocations.length - 1].timestamp;
    return aLastTimestamp - bLastTimestamp;
  });

  // Update the map initialization
  useEffect(() => {
    if (
      !isDialogReady ||
      !mapContainerRef.current ||
      mapRef.current ||
      !sortedRoutes?.length
    ) {
      return;
    }
    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
      mapboxgl.accessToken = accessToken;
      const selectedRoute = sortedRoutes[selectedRouteIndex];

      // Filter coordinates based on interval
      const coordinates = selectedRoute.geolocations
        .filter((_, index) => index % (isSmoothing ? 3 : 1) === 0)
        .map((geo) => [geo.longitude, geo.latitude]);
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(
          coordinates[0] as [number, number],
          coordinates[0] as [number, number]
        )
      );

      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        bounds: bounds, // Set initial bounds
        fitBoundsOptions: {
          padding: 50,
        },
      });

      // Remove the separate fitBounds call since we're handling it in initialization
      map.on('load', () => {
        const routeId = `route-${selectedRouteIndex}`;

        // Add the main route line
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

        // Add the main route line
        map.addLayer({
          id: routeId,
          type: 'line',
          source: routeId,
          paint: {
            'line-color': '#737373',
            'line-width': 3,
            'line-opacity': 0.7,
          },
        });

        // Add arrow symbols along the route
        map.addLayer({
          id: `${routeId}-arrows`,
          type: 'symbol',
          source: routeId,
          layout: {
            'symbol-placement': 'line',
            'symbol-spacing': 100, // Adjust spacing between arrows
            'icon-image': 'arrow',
            'icon-size': 0.7,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });

        // Load the arrow image
        map.loadImage('/icons/chevron-right.png', (error, image) => {
          if (error) throw error;
          if (!map.hasImage('arrow') && image) {
            map.addImage('arrow', image);
          }
        });

        // Add start and end markers
        // Add start marker
        new mapboxgl.Marker({ color: '#4ade80' })
          .setLngLat(coordinates[0] as [number, number])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: 'custom-popup',
            }).setText('Start')
          )
          .addTo(map);
        // Add end marker
        new mapboxgl.Marker({ color: '#fb923c' })
          .setLngLat(coordinates[coordinates.length - 1] as [number, number])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: 'custom-popup',
            }).setText('End')
          )
          .addTo(map);
      });
      mapRef.current = map;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [
    isDialogReady,
    activity.routes,
    selectedRouteIndex,
    sortedRoutes,
    isSmoothing,
  ]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-[96%] h-[96dvh] overflow-y-auto rounded-lg flex flex-col p-0 py-6">
        <DialogHeader>
          <DialogTitle>Map View</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {sortedRoutes && sortedRoutes.length > 0 ? (
            <>
              <div className="space-y-4">
                <Select
                  value={selectedRouteIndex.toString()}
                  onValueChange={(value) =>
                    setSelectedRouteIndex(Number(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedRoutes.map((route, index) => (
                      <SelectItem key={route.id} value={index.toString()}>
                        Route {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div
                ref={mapContainerRef}
                className="w-full h-[350px] rounded-md border"
              />
              <div className="flex items-center justify-between border rounded-md p-2 bg-stone-50">
                <Label className="text-sm">Route Smoothing</Label>
                <Switch
                  checked={isSmoothing}
                  onCheckedChange={(checked) => {
                    setIsSmoothing(checked);
                  }}
                />
              </div>
              <RouteStatistics route={sortedRoutes[selectedRouteIndex]} />
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
